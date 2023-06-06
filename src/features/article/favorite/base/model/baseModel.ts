import { InfiniteData, QueryClient, useMutation } from '@tanstack/react-query';
import { ArticleDto, realworldApi } from '~shared/api/realworld';

type ArticlesInfinityData = InfiniteData<ArticleDto[]>;

type MutateFnType = typeof realworldApi.articles.createArticleFavorite;

const updateInfinityData = (
  infinityData: ArticlesInfinityData,
  newArticle: ArticleDto,
) => {
  const articleOrderIdx = infinityData.pages
    .flat()
    .findIndex((article) => article.slug === newArticle.slug);

  const [pageIdx, articleIdx] = [
    Math.floor(articleOrderIdx / 10),
    articleOrderIdx % 10,
  ];

  const newArticlesInfinityData: ArticlesInfinityData = {
    pages: [
      ...infinityData.pages.slice(0, pageIdx),
      [
        ...infinityData.pages[pageIdx].slice(0, articleIdx),
        newArticle,
        ...infinityData.pages[pageIdx].slice(articleIdx + 1),
      ],
      ...infinityData.pages.slice(pageIdx + 1),
    ],

    pageParams: [
      undefined,
      ...infinityData.pages
        .slice(0, -1)
        .map((page, idx) => page.length * idx + 1),
    ],
  };

  return newArticlesInfinityData;
};

export const useMutateFavoriteArticle = (
  queryKey: unknown[],
  mutateFn: MutateFnType,
  queryClient: QueryClient,
) =>
  useMutation(
    async (article: ArticleDto) => {
      const response = await mutateFn(article.slug);
      return response.data.article;
    },

    {
      onMutate: async (newArticle) => {
        // FIXME: add types
        const isArticle = queryKey[0] === 'article';

        await queryClient.cancelQueries({ queryKey });

        const prevQueryData = queryClient.getQueryData<
          ArticleDto | ArticlesInfinityData
        >(queryKey);

        let newQueryData: ArticleDto | ArticlesInfinityData | undefined;

        switch (true) {
          case !isArticle:
            newQueryData = updateInfinityData(
              prevQueryData as ArticlesInfinityData,
              newArticle,
            );
            break;

          case isArticle:
            newQueryData = newArticle;
            break;

          default:
            newQueryData = undefined;
        }

        queryClient.setQueryData<ArticleDto | ArticlesInfinityData>(
          queryKey,
          newQueryData,
        );

        return { prevQueryData };
      },

      onError: (_, __, context) => {
        if (!context) return;
        queryClient.setQueryData(queryKey, context.prevQueryData);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );

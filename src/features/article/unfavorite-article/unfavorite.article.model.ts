import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { articleApi, articleTypes } from '~entities/article';

export function useUnfavoriteArticleMutation(article: articleTypes.Article) {
  const queryClient = useQueryClient();

  const articlesQueryKey = articleApi.ARTICLES_KEY;
  const articlesFeedQueryKey = articleApi.ARTICLES_FEED_KEY;
  const articleQueryKey = [...articleApi.ARTICLE_KEY, article.slug];

  return useMutation({
    mutationKey: [...articleApi.UNFAVORITE_ARTICLE_KEY, article.slug],
    mutationFn: articleApi.unfavoriteArticleMutation,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: articlesQueryKey });
      await queryClient.cancelQueries({ queryKey: articlesFeedQueryKey });
      await queryClient.cancelQueries({ queryKey: articleQueryKey });

      const newArticle: articleTypes.Article = {
        ...article,
        favorited: false,
        favoritesCount: article.favoritesCount - 1,
      };

      queryClient.setQueriesData<InfiniteData<articleTypes.Articles>>(
        { queryKey: articlesQueryKey },
        /* c8 ignore start */
        (prevInfinityData) => {
          if (!prevInfinityData) return undefined;
          return updateInfinityData(prevInfinityData, newArticle);
        },
        /* c8 ignore end */
      );

      queryClient.setQueriesData<InfiniteData<articleTypes.Articles>>(
        { queryKey: articlesFeedQueryKey },
        /* c8 ignore start */
        (prevInfinityData) => {
          if (!prevInfinityData) return undefined;
          return updateInfinityData(prevInfinityData, newArticle);
        },
        /* c8 ignore end */
      );

      queryClient.setQueryData<articleTypes.Article>(
        articleQueryKey,
        newArticle,
      );

      return;
    },
    onError: () => {
      queryClient.setQueriesData<InfiniteData<articleTypes.Articles>>(
        { queryKey: articlesQueryKey },
        /* c8 ignore start */
        (newInfinityData) => {
          if (!newInfinityData) return undefined;
          return updateInfinityData(newInfinityData, article);
        },
        /* c8 ignore end */
      );

      queryClient.setQueriesData<InfiniteData<articleTypes.Articles>>(
        { queryKey: articlesFeedQueryKey },
        /* c8 ignore start */
        (prevInfinityData) => {
          if (!prevInfinityData) return undefined;
          return updateInfinityData(prevInfinityData, article);
        },
        /* c8 ignore end */
      );

      queryClient.setQueryData<articleTypes.Article>(articleQueryKey, article);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: articlesQueryKey });
      await queryClient.invalidateQueries({ queryKey: articlesFeedQueryKey });
      await queryClient.invalidateQueries({ queryKey: articleQueryKey });
    },
  });
}

const updateInfinityData = (
  infinityData: InfiniteData<articleTypes.Articles>,
  newArticle: articleTypes.Article,
) => {
  const articleOrderIdx = infinityData.pages
    .flat()
    .findIndex((article) => article.slug === newArticle.slug);

  if (articleOrderIdx === -1) return { ...infinityData };

  const pageLength = infinityData.pages[0].length;
  const [pageIdx, articleIdx] = [
    Math.floor(articleOrderIdx / pageLength),
    articleOrderIdx % pageLength,
  ];

  const newArticlesInfinityData: InfiniteData<articleTypes.Articles> = {
    pages: [
      ...infinityData.pages.slice(0, pageIdx),
      [
        ...infinityData.pages[pageIdx].slice(0, articleIdx),
        newArticle,
        ...infinityData.pages[pageIdx].slice(articleIdx + 1),
      ],
      ...infinityData.pages.slice(pageIdx + 1),
    ],

    pageParams: [...infinityData.pageParams],
  };

  return newArticlesInfinityData;
};

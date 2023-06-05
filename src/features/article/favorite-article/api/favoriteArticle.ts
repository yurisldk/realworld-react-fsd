import { useMutation, InfiniteData, QueryClient } from '@tanstack/react-query';
import { ArticleDto, realworldApi } from '~shared/api/realworld';

/**
 * @see https://tanstack.com/query/v4/docs/react/guides/optimistic-updates
 * @see https://github.com/TanStack/query/discussions/3360
 */
export const useFavoriteArticle = (
  queryKey: string[],
  queryClient: QueryClient,
) =>
  useMutation(
    async (article: ArticleDto) => {
      const response = await realworldApi.articles.createArticleFavorite(
        article.slug,
      );

      return response.data.article;
    },

    {
      onMutate: async (prevArticle) => {
        await queryClient.cancelQueries({
          queryKey: ['articles', ...queryKey],
        });

        const newArticle: ArticleDto = {
          ...prevArticle,
          favoritesCount: prevArticle.favoritesCount + 1,
          favorited: true,
        };

        queryClient.setQueryData<
          InfiniteData<{
            articles: ArticleDto[];
            articlesCount: number;
          }>
        >(['articles', ...queryKey], (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              articles: page.articles.map((article) =>
                article.slug === prevArticle.slug ? newArticle : article,
              ),
            })),
            pageParams: [...old.pageParams],
          };
        });

        return { prevArticle, newArticle };
      },

      onError: (_, __, context) => {
        if (!context) return;

        queryClient.setQueryData<
          InfiniteData<{
            articles: ArticleDto[];
            articlesCount: number;
          }>
        >(['articles', ...queryKey], (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              articles: page.articles.map((article) =>
                article.slug === context.newArticle.slug
                  ? context.prevArticle
                  : article,
              ),
            })),
            pageParams: [...old.pageParams],
          };
        });
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['articles', ...queryKey] });
      },
    },
  );

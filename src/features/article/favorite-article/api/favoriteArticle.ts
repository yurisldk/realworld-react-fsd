import { useMutation, InfiniteData, QueryClient } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';

/**
 * @see https://tanstack.com/query/v4/docs/react/guides/optimistic-updates
 * @see https://github.com/TanStack/query/discussions/3360
 */
export const useFavoriteArticle = (queryClient: QueryClient) =>
  useMutation(
    async (article: conduitApi.ArticleDto) =>
      conduitApi.Articles.favoriteArticle(article.slug),
    {
      onMutate: async (prevArticle) => {
        await queryClient.cancelQueries({ queryKey: ['articles', 'global'] });

        const newArticle: conduitApi.ArticleDto = {
          ...prevArticle,
          favoritesCount: prevArticle.favoritesCount + 1,
          favorited: true,
        };

        queryClient.setQueryData<InfiniteData<conduitApi.ArticlesDto>>(
          ['articles', 'global'],
          (old) => {
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
          },
        );

        return { prevArticle, newArticle };
      },

      onError: (_, __, context) => {
        if (!context) return;

        queryClient.setQueryData<InfiniteData<conduitApi.ArticlesDto>>(
          ['articles', 'global'],
          (old) => {
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
          },
        );
      },

      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['articles', 'global'] });
      },
    },
  );

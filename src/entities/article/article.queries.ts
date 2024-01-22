import {
  InfiniteData,
  infiniteQueryOptions,
  queryOptions as tsqQueryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { StoreApi } from 'zustand';
// eslint-disable-next-line no-restricted-imports
import { profileService } from '~entities/profile/@x/article';
import { queryClient, reactQueryLib } from '~shared/lib/react-query';
import { pathKeys } from '~shared/lib/react-router';
import {
  articleQuery,
  articlesFeedQuery,
  articlesQuery,
  createArticleMutation,
  deleteArticleMutation,
  favoriteArticleMutation,
  unfavoriteArticleMutation,
  updateArticleMutation,
} from './article.api';
import { State } from './article.model';
import { Article, Articles, FilterQuery } from './article.types';

const wait = async (config: { ms: number; reject?: boolean }) =>
  new Promise((res, rej) => {
    const { ms, reject } = config;
    return setTimeout(
      () => (reject ? rej(new Error('wait error')) : res({})),
      ms,
    );
  });

const keys = {
  root: () => {
    return ['article'];
  },
  article: (slug: string) => {
    return [...keys.root(), 'bySlug', slug];
  },
  infinityQuery: () => {
    return [...keys.root(), 'infinityQuery'];
  },
  infinityQueryByFilter: (filter: FilterQuery) => {
    return [...keys.infinityQuery(), 'byFilter', filter];
  },
  favoriteArticle: (slug: string) => {
    return [...keys.root(), 'favorite', slug];
  },
  unfavoriteArticle: (slug: string) => {
    return [...keys.root(), 'unfavorite', slug];
  },
  createArticle: () => {
    return [...keys.root(), 'create'];
  },
  updateArticle: (slug: string) => {
    return [...keys.root(), 'update', slug];
  },
  deleteArticle: (slug: string) => {
    return [...keys.root(), 'delete', slug];
  },
};

export const articleService = {
  queryKey: (slug: string) => keys.article(slug),

  getCache: (slug: string) =>
    queryClient.getQueryData<Article>(articleService.queryKey(slug)),

  setCache: (article: Article) =>
    queryClient.setQueryData(articleService.queryKey(article.slug), article),

  removeCache: (slug: string) =>
    queryClient.removeQueries({ queryKey: articleService.queryKey(slug) }),

  queryOptions: (slug: string) => {
    const articleKey = articleService.queryKey(slug);
    return tsqQueryOptions({
      queryKey: articleKey,
      queryFn: async () => {
        const article = await articleQuery(slug);
        profileService.setCache(article.author); // TODO:
        return article;
      },
      initialData: () => articleService.getCache(slug)!,
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(articleKey)?.dataUpdatedAt,
    });
  },

  prefetchQuery: async (slug: string) =>
    queryClient.prefetchQuery(articleService.queryOptions(slug)),

  ensureQueryData: async (slug: string) =>
    queryClient.ensureQueryData(articleService.queryOptions(slug)),
};

export const infinityArticlesService = {
  queryKey: (filterQuery: FilterQuery) =>
    keys.infinityQueryByFilter(filterQuery),

  getCache: (filterQuery: FilterQuery) =>
    queryClient.getQueryData<InfiniteData<Articles>>(
      infinityArticlesService.queryKey(filterQuery),
    ),

  queryOptions: (filterStore: StoreApi<State>) => {
    const { pageQuery, filterQuery = {} } = filterStore.getState();
    const { following, ...filterQueryDto } = filterQuery;
    const isUserFeed = Boolean(following);

    return infiniteQueryOptions({
      queryKey: infinityArticlesService.queryKey(filterQuery),
      queryFn: async ({ pageParam, signal }) => {
        const articles = isUserFeed
          ? await articlesFeedQuery(pageParam, signal)
          : await articlesQuery(
              {
                ...pageParam,
                ...filterQueryDto,
              },
              signal,
            );

        articles.forEach((article) => {
          articleService.setCache(article); // TODO:
          profileService.setCache(article.author); // TODO:
        });

        return articles;
      },
      initialPageParam: pageQuery as any,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.length < lastPageParam.limit || !lastPage.length) {
          return null;
        }
        return {
          limit: lastPageParam.limit,
          offset: allPages.length * lastPageParam.limit,
        };
      },
      initialData: () => infinityArticlesService.getCache(filterQueryDto)!,
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(
          infinityArticlesService.queryKey(filterQueryDto),
        )?.dataUpdatedAt,
    });
  },

  prefetchQuery: async (filterStore: StoreApi<State>) =>
    queryClient.prefetchInfiniteQuery(
      infinityArticlesService.queryOptions(filterStore),
    ),

  cancelQuery: (filterQuery: FilterQuery) =>
    queryClient.cancelQueries({
      queryKey: infinityArticlesService.queryKey(filterQuery),
    }),
};

export function useFavoriteArticleMutation(slug: string) {
  const queryClient = useQueryClient();

  const favoriteKey = keys.favoriteArticle(slug);
  const articleKey = keys.article(slug);
  const infinityQueriesKey = keys.infinityQuery();

  return useMutation({
    mutationKey: favoriteKey,
    mutationFn: favoriteArticleMutation,
    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: articleKey });
      await queryClient.cancelQueries({ queryKey: infinityQueriesKey });

      const oldArticleData = articleService.getCache(slug);

      const newArticleData = oldArticleData && {
        ...oldArticleData,
        favorited: true,
        favoritesCount: oldArticleData.favoritesCount + 1,
      };

      if (newArticleData) {
        articleService.setCache(newArticleData);
      }

      queryClient.setQueriesData<InfiniteData<Articles>>(
        { queryKey: infinityQueriesKey },
        reactQueryLib.infinityQueryDataUpdater({
          id: 'slug',
          data: newArticleData,
        }),
      );

      return { oldArticleData };
    },
    onError: (_error, _variables, context) => {
      if (!context || !context.oldArticleData) return;

      articleService.setCache(context.oldArticleData);

      queryClient.setQueriesData<InfiniteData<Articles>>(
        { queryKey: infinityQueriesKey },
        reactQueryLib.infinityQueryDataUpdater({
          id: 'slug',
          data: context.oldArticleData,
        }),
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKey });
      await queryClient.invalidateQueries({ queryKey: infinityQueriesKey });
    },
  });
}

export function useUnfavoriteArticleMutation(slug: string) {
  const queryClient = useQueryClient();

  const unfavoriteKey = keys.unfavoriteArticle(slug);
  const articleKey = keys.article(slug);
  const infinityQueriesKey = keys.infinityQuery();

  return useMutation({
    mutationKey: unfavoriteKey,
    mutationFn: unfavoriteArticleMutation,
    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: articleKey });
      await queryClient.cancelQueries({ queryKey: infinityQueriesKey });

      const oldArticleData = articleService.getCache(slug);

      const newArticleData = oldArticleData && {
        ...oldArticleData,
        favorited: false,
        favoritesCount: oldArticleData.favoritesCount - 1,
      };

      if (newArticleData) {
        articleService.setCache(newArticleData);
      }

      queryClient.setQueriesData<InfiniteData<Articles>>(
        { queryKey: infinityQueriesKey },
        reactQueryLib.infinityQueryDataUpdater({
          id: 'slug',
          data: newArticleData,
        }),
      );

      return { oldArticleData };
    },
    onError: (_error, _variables, context) => {
      if (!context || !context.oldArticleData) return;

      articleService.setCache(context.oldArticleData);

      queryClient.setQueriesData<InfiniteData<Articles>>(
        { queryKey: infinityQueriesKey },
        reactQueryLib.infinityQueryDataUpdater({
          id: 'slug',
          data: context.oldArticleData,
        }),
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKey });
      await queryClient.invalidateQueries({ queryKey: infinityQueriesKey });
    },
  });
}

export function useCreateArticleMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.createArticle(),
    mutationFn: createArticleMutation,
    onSuccess: (article) => {
      articleService.setCache(article);
      navigate(pathKeys.article.bySlug({ slug: article.slug }));
    },
  });
}

export function useDeleteArticleMutation(slug: string) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.deleteArticle(slug),
    mutationFn: deleteArticleMutation,
    onSuccess: () => {
      articleService.removeCache(slug);
      navigate(pathKeys.home());
    },
  });
}

export function useUpdateArticleMutation(slug: string) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.updateArticle(slug),
    mutationFn: updateArticleMutation,
    onSuccess: async (article) => {
      articleService.setCache(article);
      navigate(pathKeys.article.bySlug({ slug: article.slug }));
    },
  });
}

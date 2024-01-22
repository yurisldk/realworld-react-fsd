import {
  InfiniteData,
  infiniteQueryOptions,
  queryOptions,
} from '@tanstack/react-query';
import { StoreApi } from 'zustand';
import { queryClient } from '~shared/lib/react-query';
import { articleQuery, articlesFeedQuery, articlesQuery } from './article.api';
import { State } from './article.model';
import { Article, Articles, FilterQueryDto } from './article.types';

export const articleKeys = {
  root: ['article'] as const,
  articles(filter: FilterQueryDto) {
    return [...articleKeys.root, 'infinityArticles', filter] as const;
  },
  articlesFeed() {
    return [...articleKeys.root, 'infinityArticlesFeed'] as const;
  },
  article(slug: string) {
    return [...articleKeys.root, slug];
  },
};

export function articlesInfinityQueryOptions(filterStore: StoreApi<State>) {
  const { pageQuery, filterQuery = {} } = filterStore.getState();
  const { following, ...filterQueryDto } = filterQuery;

  const isUserFeed = Boolean(following);

  return infiniteQueryOptions({
    queryKey: isUserFeed
      ? articleKeys.articlesFeed()
      : articleKeys.articles(filterQueryDto),
    queryFn: ({ pageParam }) =>
      isUserFeed
        ? articlesFeedQuery(pageParam)
        : articlesQuery({ ...pageParam, ...filterQueryDto }),
    // FIXME:
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
    initialData: () =>
      queryClient.getQueryData<InfiniteData<Articles>>(
        isUserFeed
          ? articleKeys.articlesFeed()
          : articleKeys.articles(filterQueryDto),
      )!,
    initialDataUpdatedAt: () =>
      queryClient.getQueryState<InfiniteData<Articles>>(
        isUserFeed
          ? articleKeys.articlesFeed()
          : articleKeys.articles(filterQueryDto),
      )?.dataUpdatedAt,
  });
}
export async function prefetchArticlesInfinityQuery(
  filterStore: StoreApi<State>,
) {
  return queryClient.prefetchInfiniteQuery(
    articlesInfinityQueryOptions(filterStore),
  );
}

export function getArticleQueryData(slug: string) {
  return queryClient.getQueryData<Article>(articleKeys.article(slug));
}
export function articleQueryOptions(slug: string) {
  const articleKey = articleKeys.article(slug);
  return queryOptions({
    queryKey: articleKey,
    queryFn: async () => articleQuery(slug),
    initialData: () => getArticleQueryData(slug)!,
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(articleKey)?.dataUpdatedAt,
  });
}
export async function prefetchArticleQuery(slug: string) {
  return queryClient.prefetchQuery(articleQueryOptions(slug));
}

import {
  InfiniteData,
  infiniteQueryOptions,
  queryOptions,
} from '@tanstack/react-query'
import { ArticleService } from '~shared/api/article'
import { queryClient } from '~shared/lib/react-query'
import {
  transformArticleDtoToArticle,
  transformArticlesDtoToArticles,
} from './article.lib'
import { Article, Articles, FilterQuery } from './article.types'

export class ArticleQueries {
  static readonly keys = {
    root: ['article'] as const,
    rootBySlug: ['article', 'by-slug'] as const,
    rootInfinity: ['article', 'infinite-articles'] as const,
    generalInfinity: [
      'article',
      'infinite-articles',
      'genearal-articles',
      'by-filter',
    ] as const,
  }

  static articleQuery(slug: string) {
    return queryOptions({
      queryKey: [...this.keys.rootBySlug, slug],
      queryFn: async ({ signal }) => {
        const data = await ArticleService.articleQuery({ slug }, signal)
        return transformArticleDtoToArticle(data)
      },
      // FIXME:
      // @ts-expect-error
      initialData: () => this.getInitialData<Article>(['article', slug]),
      initialDataUpdatedAt: () => this.getQueryDataUpdateAt(['article', slug]),
    })
  }

  static articlesInfiniteQuery(filter?: FilterQuery) {
    const { limit = 10, offset = 0, author, favorited, tag } = filter || {}

    const queryKey = [
      ...this.keys.rootInfinity,
      'genearal-articles',
      'by-filter',
      { author },
      { favorited },
      { tag },
    ].filter(Boolean) as string[]

    return infiniteQueryOptions({
      queryKey,
      queryFn: async ({ pageParam, signal }) => {
        const data = await ArticleService.articlesQuery(
          {
            query: {
              limit,
              offset: pageParam * limit,
              ...(author && { author }),
              ...(favorited && { favorited }),
              ...(tag && { tag }),
            },
          },
          signal,
        )

        const articles = transformArticlesDtoToArticles(data)

        this.setArticleData(articles)

        return articles
      },
      initialPageParam: this.getInitialPageParam({ limit, offset }),
      getNextPageParam: this.getNextPageParam,
      getPreviousPageParam: this.getPreviousPageParam,
      // @ts-expect-error FIXME:
      initialData: () =>
        this.getInitialData<InfiniteData<Articles, number>>(queryKey),
      initialDataUpdatedAt: () => this.getQueryDataUpdateAt(queryKey),
    })
  }

  static articlesFeedInfinityQuery(filter?: FilterQuery) {
    const { limit = 10, offset = 0 } = filter || {}

    const queryKey = [...this.keys.rootInfinity, 'feed-articles']

    return infiniteQueryOptions({
      queryKey,
      queryFn: async ({ pageParam, signal }) => {
        const data = await ArticleService.articlesFeedQuery(
          { query: { limit, offset: pageParam * limit } },
          signal,
        )

        const articles = transformArticlesDtoToArticles(data)

        this.setArticleData(articles)

        return articles
      },
      initialPageParam: this.getInitialPageParam({ limit, offset }),
      getNextPageParam: this.getNextPageParam,
      getPreviousPageParam: this.getPreviousPageParam,
      // @ts-expect-error FIXME:
      initialData: () =>
        this.getInitialData<InfiniteData<Articles, number>>(queryKey),
      initialDataUpdatedAt: () => this.getQueryDataUpdateAt(queryKey),
    })
  }

  private static getInitialPageParam(filter: {
    offset: number
    limit: number
  }) {
    return filter.offset / filter.limit
  }

  private static getInitialData<T>(queryKey: string[]) {
    return queryClient.getQueryData<T>(queryKey)
  }

  private static getQueryDataUpdateAt<T>(slug: string[]) {
    return queryClient.getQueryState<T>(slug)?.dataUpdatedAt
  }

  private static getNextPageParam(
    lastPage: Articles,
    _allPages: Array<Articles>,
    lastPageParam: number,
  ) {
    if (lastPage.size === 0) return
    return lastPageParam + 1
  }

  private static getPreviousPageParam(
    _firstPage: Articles,
    _allPages: Array<Articles>,
    firstPageParam: number,
  ) {
    if (firstPageParam <= 1) return
    return firstPageParam - 1
  }

  private static setArticleData(articles: Articles) {
    articles.forEach((article) => {
      queryClient.setQueryData([...this.keys.root, article.slug], article)
    })
  }
}

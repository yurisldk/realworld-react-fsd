import { LoaderFunctionArgs } from 'react-router-dom'
import { queryClient } from '~shared/lib/react-query'
import { SessionQueries, useSessionStore } from '~shared/session'
import { tabsModel } from '~shared/ui/tabs'
import { ArticleQueries } from '~entities/article'
import { tagQueries } from '~entities/tag'
import {
  MainArticleFilter,
  TagArticleFilter,
  filterArticleModel,
} from '~features/article'

export class HomeLoader {
  static async homePage(args: LoaderFunctionArgs) {
    const promises = [queryClient.prefetchQuery(tagQueries.tagsQuery())]

    if (useSessionStore.getState().session) {
      promises.push(...HomeLoader.handleUserSession())
      homeModel.setUserFeed()
    }

    if (!useSessionStore.getState().session) {
      promises.push(...HomeLoader.handleGuestSession())
      homeModel.setGlobalFeed()
    }

    Promise.all(promises)

    return args
  }

  private static handleUserSession() {
    const promises: Promise<void>[] = []

    const infinityQuery = ArticleQueries.articlesFeedInfinityQuery()
    const currentUserQuery = SessionQueries.currentSessionQuery()

    promises.push(queryClient.prefetchInfiniteQuery(infinityQuery))
    promises.push(queryClient.prefetchQuery(currentUserQuery))

    return promises
  }

  private static handleGuestSession() {
    const promises: Promise<void>[] = []

    const filter = homeModel.useHomeArticleFilterStore.getState()
    try {
      const infinityQuery = ArticleQueries.articlesInfiniteQuery(filter)
      promises.push(queryClient.prefetchInfiniteQuery(infinityQuery))

      return promises
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

class HomeModel implements MainArticleFilter, TagArticleFilter {
  readonly useHomeArticleFilterStore

  readonly useHomeTabsStore

  constructor() {
    this.useHomeArticleFilterStore =
      filterArticleModel.createArticleFilterStore({
        devtoolsOptions: { name: 'Home Article Filter Store' },
      })

    this.useHomeTabsStore = tabsModel.createTabsStore({
      initialState: { tab: 'user-feed' },
      devtoolsOptions: { name: 'Home Tabs Store' },
    })
  }

  useTag() {
    return this.useHomeArticleFilterStore.use.tag()
  }

  useTab() {
    return this.useHomeTabsStore.use.tab()
  }

  onTabChange = (tab: string) => {
    const bound = this.setGlobalFeed.bind(this)

    if (tab === 'user-feed') {
      this.setUserFeed()
    }
    if (tab === 'global-feed') {
      bound()
    }
  }

  onTagClick = (tag: string) => {
    this.setTagFeed(tag)
  }

  setUserFeed() {
    this.useHomeTabsStore.getState().setTab('user-feed')
  }

  setGlobalFeed() {
    this.useHomeArticleFilterStore.getState().reset()
    this.useHomeTabsStore.getState().setTab('global-feed')
  }

  private setTagFeed(tag: string) {
    this.useHomeArticleFilterStore.getState().reset()
    this.useHomeArticleFilterStore.getState().setTag(tag)
    this.useHomeTabsStore.getState().setTab('tag-feed')
  }
}

export const homeModel = new HomeModel()

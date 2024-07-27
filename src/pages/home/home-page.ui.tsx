import { ArticleQueries } from '~entities/article'
import { MainFilter, TagFilter } from '~features/article'
import { ArticlesFeed } from '~widgets/articles-feed'
import { homeModel } from './home-page.model'

export function HomePage() {
  const tab = homeModel.useHomeTabsStore.use.tab()
  const isUserFeed = tab === 'user-feed'
  const isGlobalFeed = tab === 'global-feed'
  const isTagFeed = tab === 'tag-feed'

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <MainFilter mainArticleFilter={homeModel} />

            {isUserFeed && (
              <ArticlesFeed
                articlesInfiniteQueryOptions={boundArticlesFeedInfinityQuery}
              />
            )}

            {(isGlobalFeed || isTagFeed) && (
              <ArticlesFeed
                useArticleFilterStore={homeModel.useHomeArticleFilterStore}
                articlesInfiniteQueryOptions={boundArticlesInfiniteQuery}
              />
            )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <TagFilter tagArticleFilter={homeModel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const boundArticlesFeedInfinityQuery =
  ArticleQueries.articlesFeedInfinityQuery.bind(ArticleQueries)

const boundArticlesInfiniteQuery =
  ArticleQueries.articlesInfiniteQuery.bind(ArticleQueries)

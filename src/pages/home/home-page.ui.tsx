import { useSuspenseQuery } from '@tanstack/react-query';
import cn from 'classnames';
import { useStore } from 'zustand';
import { sessionQueries } from '~entities/session';
import { ArticlesList } from '~widgets/articles-list';
import { PopularTags } from '~widgets/popular-tags';
import {
  articleFilterStore,
  onArticles,
  onArticlesFeed,
  onTag,
  tabStore,
} from './home-page.model';

export function HomePage() {
  const { data: user } = useSuspenseQuery(
    sessionQueries.currentUserQueryOptions(),
  );

  const activeTab = useStore(tabStore, (state) => state.tab);

  const { tag } =
    useStore(articleFilterStore, (state) => state.filterQuery) || {};

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
            <ul className="nav nav-pills outline-active">
              {user && (
                <li className="nav-item">
                  <button
                    className={cn('nav-link', {
                      active: activeTab === 'articlesFeed',
                    })}
                    type="button"
                    onClick={onArticlesFeed}
                  >
                    Your Feed
                  </button>
                </li>
              )}
              <li className="nav-item">
                <button
                  className={cn('nav-link', {
                    active: activeTab === 'articles',
                  })}
                  type="button"
                  onClick={onArticles}
                >
                  Global Feed
                </button>
              </li>
              {activeTab === 'tag' && (
                <li className="nav-item">
                  <button
                    className={cn('nav-link', { active: activeTab === 'tag' })}
                    type="button"
                  >
                    #{tag}
                  </button>
                </li>
              )}
            </ul>

            <ArticlesList filterStore={articleFilterStore} />
          </div>

          <div className="col-md-3">
            <PopularTags onTagClicked={onTag} />
          </div>
        </div>
      </div>
    </div>
  );
}

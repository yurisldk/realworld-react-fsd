import { useQuery } from '@tanstack/react-query';
import cn from 'classnames';
import { useStore } from 'zustand';
import { sessionApi } from '~entities/session';
import { ArticlesList } from '~widgets/articles-list';
import { PopularTags } from '~widgets/popular-tags';
import {
  filterByCategoryStore,
  filterByPageStore,
  homePageStore,
} from './home-page.model';

const onArticlesFeedClicked = homePageStore.getState().onArticlesFeedClicked;
const onArticlesClicked = homePageStore.getState().onArticlesClicked;

export function HomePage() {
  const { data: user } = useQuery({
    queryKey: sessionApi.CURRENT_USER_KEY,
    queryFn: sessionApi.currentUserQuery,
  });

  const activeTab = useStore(homePageStore, (state) => state.activeTab);
  const { tag } = useStore(filterByCategoryStore, (state) => state.filter);

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
                    onClick={() => onArticlesFeedClicked(user.username)}
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
                  onClick={onArticlesClicked}
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

            <ArticlesList
              filterByCategoryStore={filterByCategoryStore}
              filterByPageStore={filterByPageStore}
            />
          </div>

          <div className="col-md-3">
            <PopularTags filterByCategoryStore={filterByCategoryStore} />
          </div>
        </div>
      </div>
    </div>
  );
}

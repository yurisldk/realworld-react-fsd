import { useLayoutEffect } from 'react';
import { StoreApi } from 'zustand';
import { articleFilterModel } from '~entities/article';
import { sessionModel } from '~entities/session';
import { FilterArticleTabButton } from '~features/article';
import { CommonArticlesList } from '~widgets/common-articles-list';
import { FeedArticlesList } from '~widgets/feed-articles-list';
import { PopularTags } from '~widgets/popular-tags';
import {
  homePageArticleFilterStore,
  initialFilterState,
} from '../../model/homePageArticleFilter';

type HomePageProps = {
  model?: StoreApi<articleFilterModel.ArticleFilterState>;
};

export function HomePage(props: HomePageProps) {
  const { model = homePageArticleFilterStore } = props;

  const filter = articleFilterModel.selectFilter(model);

  const isAuth = sessionModel.useAuth();

  useLayoutEffect(() => {
    model.getState().setFilter({
      ...(isAuth && { userfeed: true }),
      ...(!isAuth && { global: true }),
    });

    return () => model.getState().resetFilter(initialFilterState);
  }, [isAuth, model]);

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
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {isAuth && (
                  <li className="nav-item">
                    <FilterArticleTabButton
                      model={model}
                      filter={{ userfeed: true }}
                      title="Your Feed"
                    />
                  </li>
                )}
                <li className="nav-item">
                  <FilterArticleTabButton
                    model={model}
                    filter={{ global: true }}
                    title="Global Feed"
                  />
                </li>
                {filter.tag && (
                  <li className="nav-item">
                    <FilterArticleTabButton
                      model={model}
                      filter={{ tag: filter.tag }}
                      title={`#${filter.tag}`}
                    />
                  </li>
                )}
              </ul>
            </div>

            {filter.userfeed && <FeedArticlesList model={model} />}
            {!filter.userfeed && <CommonArticlesList model={model} />}
          </div>

          <div className="col-md-3">
            <PopularTags model={model} />
          </div>
        </div>
      </div>
    </div>
  );
}

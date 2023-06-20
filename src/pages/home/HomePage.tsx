import { useState } from 'react';
import cn from 'classnames';
import { GlobalArticlesList } from '~widgets/global-articles-list';
import { PopularTags } from '~widgets/popular-tags';
import { UserArticlesList } from '~widgets/user-articles-list';

type HomePageProps = {
  auth?: boolean;
};

type TabsState = {
  globalfeed?: boolean;
  userfeed?: boolean;
  tagfeed?: string;
};

export function HomePage(props: HomePageProps) {
  const { auth } = props;

  const initTabsState: TabsState = {
    ...(auth && { userfeed: true }),
    ...(!auth && { globalfeed: true }),
  };

  const [tabs, setTabs] = useState<TabsState>(initTabsState);

  const onUserfeedClick = () => setTabs({ userfeed: true });
  const onGlobalfeedClick = () => setTabs({ globalfeed: true });
  const onTabfeedClick = (tag: string) => setTabs({ tagfeed: tag });

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
                {auth && (
                  <li className="nav-item">
                    <button
                      className={cn('nav-link', { active: tabs.userfeed })}
                      type="button"
                      onClick={onUserfeedClick}
                    >
                      Your Feed
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className={cn('nav-link', { active: tabs.globalfeed })}
                    type="button"
                    onClick={onGlobalfeedClick}
                  >
                    Global Feed
                  </button>
                </li>
                {tabs.tagfeed && (
                  <li className="nav-item">
                    <button
                      className={cn('nav-link', { active: tabs.tagfeed })}
                      type="button"
                    >
                      #{tabs.tagfeed}
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {tabs.userfeed && (
              <UserArticlesList query={{ limit: 10, offset: 0 }} />
            )}

            {tabs.globalfeed && (
              <GlobalArticlesList query={{ limit: 10, offset: 0 }} />
            )}

            {tabs.tagfeed && (
              <GlobalArticlesList
                query={{ limit: 10, offset: 0, tag: tabs.tagfeed }}
              />
            )}
          </div>

          <div className="col-md-3">
            <PopularTags onTagClick={onTabfeedClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

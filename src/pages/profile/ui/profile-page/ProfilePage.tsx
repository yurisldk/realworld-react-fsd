import { useState } from 'react';
import cn from 'classnames';
import { useParams } from 'react-router-dom';
import { CommonArticlesList } from '~widgets/common-articles-list';
import { ProfileCard } from '~widgets/profile-card';

type ProfilePageProps = {
  favorites?: boolean;
};

type TabsState = {
  author?: string;
  favorited?: string;
};

export function ProfilePage(props: ProfilePageProps) {
  const { favorites } = props;

  const { username } = useParams();

  const initTabsState: TabsState = {
    ...(favorites && { favorited: username }),
    ...(!favorites && { author: username }),
  };

  const [tabs, setTabs] = useState<TabsState>(initTabsState);

  const onAuthorfeedClick = () => setTabs({ author: username });
  const onFavoritedfeedClick = () => setTabs({ favorited: username });

  return (
    <div className="profile-page">
      <ProfileCard username={username!} />

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <button
                    className={cn('nav-link', { active: tabs.author })}
                    type="button"
                    onClick={onAuthorfeedClick}
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={cn('nav-link', { active: tabs.favorited })}
                    type="button"
                    onClick={onFavoritedfeedClick}
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>

            {tabs.author && (
              <CommonArticlesList
                query={{ limit: 10, offset: 0, author: tabs.author }}
              />
            )}

            {tabs.favorited && (
              <CommonArticlesList
                query={{ limit: 10, offset: 0, favorited: tabs.favorited }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

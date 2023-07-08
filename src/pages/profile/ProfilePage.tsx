import { useParams } from 'react-router-dom';
import { Tabs, useTabs } from '~shared/ui/tabs';
import { GlobalArticlesList } from '~widgets/global-articles-list';
import { ProfileCard } from '~widgets/profile-card';

type ProfilePageProps = {
  favorites?: boolean;
};

enum TabKey {
  Author = 'Author',
  Favorited = 'Favorited',
}

export function ProfilePage(props: ProfilePageProps) {
  const { favorites } = props;

  const { username } = useParams();

  const { tabsState, onTabsChange, activeTab } = useTabs({
    initialItems: [
      {
        key: TabKey.Author,
        active: !favorites,
        label: 'My Articles',
      },
      {
        key: TabKey.Favorited,
        active: favorites,
        label: 'Favorited Articles',
      },
    ],
  });

  return (
    <div className="profile-page">
      <ProfileCard username={username!} />

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <Tabs items={tabsState} onChange={onTabsChange} />
            </div>

            {activeTab?.key === TabKey.Author && (
              <GlobalArticlesList
                query={{ limit: 10, offset: 0, author: username }}
              />
            )}

            {activeTab?.key === TabKey.Favorited && (
              <GlobalArticlesList
                query={{ limit: 10, offset: 0, favorited: username }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs } from '~shared/ui/tabs';
import { ProfileCard } from '~widgets/profile-card';

type ProfilePageProps = {
  favorites?: boolean;
};

export function ProfilePage(props: ProfilePageProps) {
  const { favorites } = props;

  const { username } = useParams();

  const [activeTab, setActiveTab] = useState(
    favorites ? 'favoritedfeed' : 'authorfeed',
  );

  return (
    <div className="profile-page">
      <ProfileCard username={username!} />

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <Tabs keepUnmounted value={activeTab} onTabChange={setActiveTab}>
              <div className="articles-toggle">
                <Tabs.List>
                  <Tabs.Tab value="authorfeed">My Articles</Tabs.Tab>
                  <Tabs.Tab value="favoritedfeed">Favorited Articles</Tabs.Tab>
                </Tabs.List>
              </div>

              {/* <Tabs.Panel value="authorfeed"> */}
              {/* <GlobalArticlesList
                  query={{ limit: 10, offset: 0, author: username }}
                /> */}
              {/* </Tabs.Panel> */}

              {/* <Tabs.Panel value="favoritedfeed"> */}
              {/* <GlobalArticlesList
                  query={{ limit: 10, offset: 0, favorited: username }}
                /> */}
              {/* </Tabs.Panel> */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

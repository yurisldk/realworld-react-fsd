import { useState } from 'react';
import { Tabs } from '~shared/ui/tabs';
import { GlobalArticlesList } from '~widgets/global-articles-list';
import { PopularTags } from '~widgets/popular-tags';
import { UserArticlesList } from '~widgets/user-articles-list';

type HomePageProps = {
  auth?: boolean;
};

export function HomePage(props: HomePageProps) {
  const { auth } = props;

  const [activeTab, setActiveTab] = useState(auth ? 'userfeed' : 'globalfeed');

  const [tag, setTag] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    if (value !== 'tagfeed') setTag(null);
    setActiveTab(value);
  };

  const handleTagClick = (_tag: string) => {
    setTag(_tag);
    setActiveTab('tagfeed');
  };

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
            <Tabs keepUnmounted value={activeTab} onTabChange={handleTabChange}>
              <div className="feed-toggle">
                <Tabs.List>
                  {auth && <Tabs.Tab value="userfeed">Your Feed</Tabs.Tab>}
                  <Tabs.Tab value="globalfeed">Global Feed</Tabs.Tab>
                  {tag && <Tabs.Tab value="tagfeed">#{tag}</Tabs.Tab>}
                </Tabs.List>
              </div>

              <Tabs.Panel value="userfeed">
                <UserArticlesList query={{ limit: 10, offset: 0 }} />
              </Tabs.Panel>

              <Tabs.Panel value="globalfeed">
                <GlobalArticlesList query={{ limit: 10, offset: 0 }} />
              </Tabs.Panel>

              <Tabs.Panel value="tagfeed">
                <GlobalArticlesList
                  query={{ limit: 10, offset: 0, tag: tag! }}
                />
              </Tabs.Panel>
            </Tabs>
          </div>

          <div className="col-md-3">
            <PopularTags onTagClick={handleTagClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

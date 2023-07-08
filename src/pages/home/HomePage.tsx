import { Tabs, TabsProps, useTabs } from '~shared/ui/tabs';
import { GlobalArticlesList } from '~widgets/global-articles-list';
import { PopularTags } from '~widgets/popular-tags';
import { UserArticlesList } from '~widgets/user-articles-list';

type HomePageProps = {
  auth?: boolean;
};

enum TabKey {
  Userfeed = 'userfeed',
  Globalfeed = 'globalfeed',
  Tagfeed = 'tagfeed',
}

export function HomePage(props: HomePageProps) {
  const { auth } = props;

  const {
    tabsState,
    activeTab,
    removeTab,
    activateTab,
    addTab,
    deactivateAllTabs,
  } = useTabs({
    initialItems: [
      {
        key: TabKey.Userfeed,
        label: `#${TabKey.Userfeed}`,
        active: auth,
        hidden: !auth,
      },
      {
        key: TabKey.Globalfeed,
        label: `#${TabKey.Globalfeed}`,
        active: !auth,
        hidden: false,
      },
    ],
  });

  const onTabfeedClick = (tag: string) => {
    deactivateAllTabs();
    removeTab(TabKey.Tagfeed);
    addTab({
      key: TabKey.Tagfeed,
      label: `#${tag}`,
      active: true,
      hidden: false,
    });
  };

  const handleTabsChange: TabsProps['onChange'] = (selectedTab) => {
    removeTab(TabKey.Tagfeed);
    activateTab(selectedTab.key);
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
            <div className="feed-toggle">
              <Tabs items={tabsState} onChange={handleTabsChange} />
            </div>

            {activeTab?.key === TabKey.Userfeed && (
              <UserArticlesList query={{ limit: 10, offset: 0 }} />
            )}

            {activeTab?.key === TabKey.Globalfeed && (
              <GlobalArticlesList query={{ limit: 10, offset: 0 }} />
            )}

            {activeTab?.key === TabKey.Tagfeed && (
              <GlobalArticlesList
                query={{ limit: 10, offset: 0, tag: activeTab.key }}
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

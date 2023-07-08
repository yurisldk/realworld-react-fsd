import { useCallback, useMemo, useState } from 'react';
import { TabItem } from './Tabs';

export type UseTabsProps = {
  initialItems: TabItem[];
};

export function useTabs({ initialItems }: UseTabsProps) {
  const [tabsState, setTabsState] = useState(initialItems);

  const onChange = useCallback((selectedTab: TabItem) => {
    setTabsState((prevState) =>
      prevState.map((stateItem) => ({
        ...stateItem,
        active: stateItem.key === selectedTab.key,
      })),
    );
  }, []);

  const addTab = useCallback((tabItem: TabItem, index?: number) => {
    setTabsState((prevState) => {
      const stateCopy = [...prevState];
      stateCopy.splice(index || prevState.length, 0, tabItem);
      return stateCopy;
    });
  }, []);

  const removeTab = useCallback((tabKey: TabItem['key']) => {
    setTabsState((prev) => prev.filter((item) => item.key !== tabKey));
  }, []);

  const activateTab = useCallback((tabKey: TabItem['key']) => {
    setTabsState((prevState) =>
      prevState.map((item) => ({ ...item, active: item.key === tabKey })),
    );
  }, []);

  const deactivateAllTabs = useCallback(() => {
    setTabsState((prev) => prev.map((item) => ({ ...item, active: false })));
  }, []);

  const activeTab = useMemo(
    () => tabsState.find((item) => item.active),
    [tabsState],
  );

  return {
    tabsState,
    activeTab,
    setTabsState,
    addTab,
    removeTab,
    activateTab,
    deactivateAllTabs,
    onTabsChange: onChange,
  };
}

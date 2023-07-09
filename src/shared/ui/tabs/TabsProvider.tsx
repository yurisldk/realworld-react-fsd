import { ReactNode, useMemo } from 'react';
import { TabsContext, TabsContextProps } from './Tabs.context';

type TabsProviderProps = TabsContextProps & {
  children: ReactNode;
};

export function TabsProvider(props: TabsProviderProps) {
  const { value, onTabChange, keepUnmounted = false, children } = props;

  const memoizedValue = useMemo(
    () => ({ value, onTabChange, keepUnmounted }),
    [keepUnmounted, onTabChange, value],
  );

  return (
    <TabsContext.Provider value={memoizedValue}>
      {children}
    </TabsContext.Provider>
  );
}

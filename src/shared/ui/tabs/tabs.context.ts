import { createContext, useContext } from 'react';

export type TabsContextProps = {
  value: string;
  onTabChange: (value: string) => void;
  keepUnmounted: boolean;
};

export const TabsContext = createContext<TabsContextProps | null>(null);
TabsContext.displayName = 'TabsContext';

export function useTabsContext() {
  const ctx = useContext(TabsContext);

  if (!ctx) {
    throw new Error('useTabsContext must be used within a <Tabs />');
  }

  return ctx;
}

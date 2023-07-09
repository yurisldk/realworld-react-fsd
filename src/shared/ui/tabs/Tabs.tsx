import { ReactNode } from 'react';
import { Tab } from './Tab';
import { TabsContextProps } from './Tabs.context';
import { TabsList } from './TabsList';
import { TabsPanel } from './TabsPanel';
import { TabsProvider } from './TabsProvider';

type TabsProps = TabsContextProps & {
  children: ReactNode;
};

export function Tabs(props: TabsProps) {
  const { value, onTabChange, keepUnmounted = false, children } = props;

  return (
    <TabsProvider
      value={value}
      onTabChange={onTabChange}
      keepUnmounted={keepUnmounted}
    >
      {children}
    </TabsProvider>
  );
}

Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabsPanel;

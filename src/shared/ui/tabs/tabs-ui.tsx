import { ReactNode } from 'react';
import cn from 'classnames';
import { TabsProvider } from './tabs-provider';
import { TabsContextProps, useTabsContext } from './tabs.context';

type TabsProps = TabsContextProps & { children: ReactNode };
function Tabs(props: TabsProps) {
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

type TabsListProps = { children: ReactNode };
function TabsList(props: TabsListProps) {
  return <ul className="nav nav-pills outline-active">{props.children}</ul>;
}

type TabProps = {
  value: string;
  children?: ReactNode;
};

function Tab(props: TabProps) {
  const { value, children } = props;
  const ctx = useTabsContext();

  const isActive = value === ctx.value;

  const activateTab = () => ctx.onTabChange(value);

  return (
    <li className="nav-item">
      <button
        className={cn('nav-link', { active: isActive })}
        type="button"
        onClick={activateTab}
      >
        {children}
      </button>
    </li>
  );
}

type TabsPanelProps = {
  value: string;
  children: ReactNode;
};

function TabsPanel(props: TabsPanelProps) {
  const { value, children } = props;
  const ctx = useTabsContext();

  const active = ctx.value === value;

  let content: ReactNode;

  if (ctx.keepUnmounted) content = active ? children : null;
  if (!ctx.keepUnmounted) content = children;

  return <div style={{ display: !active ? 'none' : undefined }}>{content}</div>;
}

Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabsPanel;

export { Tabs };

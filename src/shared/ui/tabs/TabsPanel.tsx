import { ReactNode } from 'react';
import { useTabsContext } from './Tabs.context';

type TabsPanelProps = {
  value: string;
  children: ReactNode;
};

export function TabsPanel(props: TabsPanelProps) {
  const { value, children } = props;
  const ctx = useTabsContext();

  const active = ctx.value === value;

  let content: ReactNode;

  if (ctx.keepUnmounted) content = active ? children : null;
  if (!ctx.keepUnmounted) content = children;

  return <div style={{ display: !active ? 'none' : undefined }}>{content}</div>;
}

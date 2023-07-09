import { ReactNode } from 'react';

type TabsListProps = {
  children: ReactNode;
};

export function TabsList(props: TabsListProps) {
  const { children } = props;

  return <ul className="nav nav-pills outline-active">{children}</ul>;
}

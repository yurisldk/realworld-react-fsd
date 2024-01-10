import { ReactNode } from 'react';
import cn from 'classnames';
import { useTabsContext } from './Tabs.context';

type TabProps = {
  value: string;
  children?: ReactNode;
};

export function Tab(props: TabProps) {
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

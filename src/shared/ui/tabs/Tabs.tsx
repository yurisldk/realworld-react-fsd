import { ReactNode } from 'react';
import cn from 'classnames';

export type TabItem = {
  key: string;
  label: ReactNode;
  active?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
};

export type TabsProps = {
  items: TabItem[];
  onChange?: (activeKey: TabItem) => void;
  className?: string;
};

export function Tabs({ items, className, onChange }: TabsProps) {
  const handleClick = (tab: TabItem) => () => {
    onChange?.(tab);
  };

  return (
    <ul className={cn('nav nav-pills', 'outline-active', className || '')}>
      {items.map((tab) => {
        if (tab.hidden) return null;

        return (
          <li className={cn('nav-item', tab.className || '')} key={tab.key}>
            <button
              className={cn('nav-link', {
                active: tab.active,
                disabled: tab.disabled,
              })}
              type="button"
              onClick={handleClick(tab)}
            >
              {tab.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

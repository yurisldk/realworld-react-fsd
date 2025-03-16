import { ForwardedRef, ReactNode, createContext, forwardRef, useContext, useMemo } from 'react';
import cn from 'classnames';

type TabsContextProps = {
  contextValue: string;
  onContextValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextProps | null>(null);
TabsContext.displayName = 'TabsContext';

function useTabsContext() {
  const ctx = useContext(TabsContext);

  if (!ctx) {
    throw new Error('useTabsContext must be used within a <Root />');
  }

  return ctx;
}

type RootProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
};

function Root(props: RootProps) {
  const { value, onValueChange, children } = props;

  const memoizedValue: TabsContextProps = useMemo(
    () => ({
      contextValue: value,
      onContextValueChange: onValueChange,
    }),
    [onValueChange, value],
  );

  return <TabsContext.Provider value={memoizedValue}>{children}</TabsContext.Provider>;
}

type ListProps = {
  children: ReactNode;
};

const List = forwardRef((props: ListProps, ref?: ForwardedRef<HTMLUListElement>) => {
  const { children } = props;

  return (
    <ul ref={ref} className="nav nav-pills outline-active">
      {children}
    </ul>
  );
});

type TriggerProps = {
  value: string;
  children: ReactNode;
};

const Trigger = forwardRef((props: TriggerProps, ref?: ForwardedRef<HTMLLIElement>) => {
  const { value, children } = props;

  const { contextValue, onContextValueChange } = useTabsContext();

  const active = value === contextValue;

  const classes = cn('nav-link', { active });

  const handleClick = () => {
    onContextValueChange(value);
  };

  return (
    <li ref={ref} className="nav-item">
      <button className={classes} type="button" onClick={handleClick}>
        {children}
      </button>
    </li>
  );
});

type ContentProps = {
  value: string;
  children: ReactNode;
};

function Content(props: ContentProps) {
  const { value, children } = props;

  const { contextValue } = useTabsContext();

  const active = value === contextValue;

  return active && children;
}

export const Tabs = {
  Root,
  List,
  Trigger,
  Content,
};

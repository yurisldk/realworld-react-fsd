import React, { CSSProperties } from 'react';
import cn from 'classnames';
import * as styles from './stack.module.css';

export function Stack(props: {
  direction?: 'column-reverse' | 'column' | 'row-reverse' | 'row';
  spacing?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  noWrap?: boolean;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  const {
    direction = 'row',
    spacing = 8,
    alignItems = 'stretch',
    justifyContent = 'flex-start',
    noWrap = false,
    style,
    children,
  } = props;

  const classNames = cn(
    styles.stack,
    styles[`stack-${direction}`],
    styles[`stack-align-items-${alignItems}`],
    styles[`stack-justify-content-${justifyContent}`],
    { [styles['stack-wrap']]: !noWrap },
  );

  return (
    <div className={classNames} style={{ gap: `${spacing}px`, ...style }}>
      {children}
    </div>
  );
}

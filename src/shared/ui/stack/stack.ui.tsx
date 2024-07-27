import React, { CSSProperties } from 'react'
import cn from 'classnames'
import stackStyles from './stack.module.css'

export function Stack(props: {
  direction?: 'column-reverse' | 'column' | 'row-reverse' | 'row'
  spacing?: number
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  noWrap?: boolean
  style?: CSSProperties
  children: React.ReactNode
}) {
  const {
    direction = 'row',
    spacing = 8,
    alignItems = 'stretch',
    justifyContent = 'flex-start',
    noWrap = false,
    style,
    children,
  } = props

  const classNames = cn(
    stackStyles.stack,
    stackStyles[`stack-${direction}`],
    stackStyles[`stack-align-items-${alignItems}`],
    stackStyles[`stack-justify-content-${justifyContent}`],
    { [stackStyles['stack-wrap']]: !noWrap },
  )

  return (
    <div
      className={classNames}
      style={{ gap: `${spacing}px`, ...style }}
    >
      {children}
    </div>
  )
}

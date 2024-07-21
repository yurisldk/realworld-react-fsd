import { CSSProperties } from 'react'
import cn from 'classnames'
import skeletonStyles from './skeleton.module.css'

export function Skeleton(props: {
  variant?: 'circular' | 'rectangular' | 'rounded' | 'text'
  width?: number | string
  height?: number | string
  animation?: 'pulse' | 'wave'
  style?: CSSProperties
}) {
  const {
    variant = 'text',
    width = 80,
    height = 16,
    animation = 'wave',
    style,
  } = props

  const classNames = cn({
    [skeletonStyles.skeleton]: true,
    [skeletonStyles[`skeleton-${variant}`]]: true,
    [skeletonStyles[`skeleton-${animation}`]]: animation,
  })

  const styles = {
    width: isNumber(width) ? `${width}px` : width,
    height: isNumber(height) ? `${height}px` : height,
    ...style,
  }

  return (
    <div
      className={classNames}
      style={styles}
    />
  )
}

function isNumber(value: string | number): value is number {
  return typeof value === 'number'
}

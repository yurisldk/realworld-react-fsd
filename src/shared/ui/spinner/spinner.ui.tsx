import cn from 'classnames'
import spinnerStyles from './spinner.module.css'

type SpinnerProps = {
  display?: boolean
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'center'
}

export function Spinner(props: SpinnerProps) {
  const { display = false, position = 'top-right' } = props

  const spinnerClasses = cn({
    [spinnerStyles.spinner]: true,
    [spinnerStyles.display]: display,
    [spinnerStyles[`position-${position}`]]: true,
  })

  return (
    <div className={spinnerClasses}>
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}

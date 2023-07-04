import { ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'primary' | 'secondary';
  variant?: 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export function Button(props: ButtonProps) {
  const {
    type = 'button',
    color = 'primary',
    size = 'sm',
    variant,
    className,
    ...other
  } = props;

  const classes = cn(
    {
      btn: true,
      [`btn-${color}`]: color && !variant,
      [`btn-${variant}-${color}`]: color && variant,
      [`btn-${size}`]: size,
    },
    className,
  );

  // eslint-disable-next-line react/button-has-type
  return <button className={classes} type={type} {...other} />;
}

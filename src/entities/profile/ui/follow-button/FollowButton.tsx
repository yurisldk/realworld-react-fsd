import { ReactNode } from 'react';
import cn from 'classnames';
import { IoAdd, IoRemove } from 'react-icons/io5';

type FollowButtonProps = {
  title?: ReactNode;
  following?: boolean;
  onClick?: VoidFunction;
};

export function FollowButton(props: FollowButtonProps) {
  const { title, following = false, onClick } = props;

  const classes = cn('btn btn-sm', 'action-btn', {
    'btn-secondary': following,
    'btn-outline-secondary': !following,
  });

  return (
    <button className={classes} type="button" onClick={onClick}>
      {following ? (
        <IoRemove size={16} data-testid="icon-remove" />
      ) : (
        <IoAdd size={16} data-testid="icon-add" />
      )}
      &nbsp;{following ? 'Unfollow' : 'Follow'} {title}
    </button>
  );
}

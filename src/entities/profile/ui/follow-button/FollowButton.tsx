import { ReactNode } from 'react';
import cn from 'classnames';

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
      <i
        className={cn({
          'ion-minus-round': following,
          'ion-plus-round': !following,
        })}
        data-testid="icon"
      />
      &nbsp; {following ? 'Unfollow' : 'Follow'} {title}
    </button>
  );
}

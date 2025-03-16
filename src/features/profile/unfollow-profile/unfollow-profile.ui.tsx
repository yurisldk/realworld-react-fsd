import { IoRemove } from 'react-icons/io5';
import { Button } from '~shared/ui/button/button.ui';
import { useUnfollowProfileMutation } from './unfollow-profile.mutation';

export function UnfollowUserButton(props: { username: string }) {
  const { username } = props;

  const { mutate } = useUnfollowProfileMutation({ mutationKey: [username] });

  const handleClick = () => {
    mutate(username);
  };

  return (
    <Button color="secondary" className="action-btn " onClick={handleClick}>
      <IoRemove size={16} />
      &nbsp; Unfollow {username}
    </Button>
  );
}

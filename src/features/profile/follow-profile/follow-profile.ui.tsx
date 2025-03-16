import { IoAdd } from 'react-icons/io5';
import { Button } from '~shared/ui/button/button.ui';
import { useFollowProfileMutation } from './follow-profile.mutation';

export function FollowUserButton(props: { username: string }) {
  const { username } = props;

  const { mutate } = useFollowProfileMutation({ mutationKey: [username] });

  const handleClick = () => {
    mutate(username);
  };

  return (
    <Button color="secondary" variant="outline" className="action-btn " onClick={handleClick}>
      <IoAdd size={16} />
      &nbsp; Follow {username}
    </Button>
  );
}

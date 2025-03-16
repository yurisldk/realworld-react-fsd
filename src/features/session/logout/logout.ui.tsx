import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { useLogoutMutation } from './logout.mutation';

export default function LogoutButton() {
  const navigate = useNavigate();

  const { mutate } = useLogoutMutation({
    onSuccess() {
      navigate(pathKeys.home);
    },
  });

  const handleClick = () => {
    mutate();
  };

  return (
    <button className="btn btn-outline-danger" type="button" onClick={handleClick}>
      Or click here to logout.
    </button>
  );
}

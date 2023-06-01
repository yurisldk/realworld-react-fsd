import { useQueryClient } from '@tanstack/react-query';
import { logout } from '../../model/logout';

export function LogoutButton() {
  const queryClient = useQueryClient();

  const handleClick = () => logout(queryClient);

  return (
    <button
      className="btn btn-outline-danger"
      type="button"
      onClick={handleClick}
    >
      Or click here to logout.
    </button>
  );
}

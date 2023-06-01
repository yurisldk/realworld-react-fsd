import { useNavigate } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';

type NavigateToLoginFavoriteButtonProps = {
  favoritesCount: number;
};

export function NavigateToLoginFavoriteButton(
  props: NavigateToLoginFavoriteButtonProps,
) {
  const { favoritesCount } = props;
  const navigate = useNavigate();

  const handleClick = () => navigate(PATH_PAGE.login);

  return (
    <button
      className="btn btn-outline-primary btn-sm pull-xs-right"
      type="button"
      onClick={handleClick}
    >
      <i className="ion-heart" /> {favoritesCount}
    </button>
  );
}

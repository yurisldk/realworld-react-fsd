import { useQueryClient } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';
import { useFavoriteArticle } from '../../api/favoriteArticle';

type FavoriteArticleButtonProps = {
  article: conduitApi.ArticleDto;
};

export function FavoriteArticleButton(props: FavoriteArticleButtonProps) {
  const { article } = props;

  const queryClient = useQueryClient();

  const favoriteArticle = useFavoriteArticle(queryClient);

  const handleFavorite = async () => {
    await favoriteArticle.mutateAsync(article);
  };

  return (
    <button
      className="btn btn-outline-primary btn-sm pull-xs-right"
      type="button"
      onClick={handleFavorite}
    >
      <i className="ion-heart" /> {article.favoritesCount}
    </button>
  );
}

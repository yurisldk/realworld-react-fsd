import { useQueryClient } from '@tanstack/react-query';
import { ArticleDto } from '~shared/api/realworld';
import { useFavoriteArticle } from '../../api/favoriteArticle';

type FavoriteArticleButtonProps = {
  queryKey: string[];
  article: ArticleDto;
};

export function FavoriteArticleButton(props: FavoriteArticleButtonProps) {
  const { article, queryKey } = props;

  const queryClient = useQueryClient();

  const favoriteArticle = useFavoriteArticle(queryKey, queryClient);

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

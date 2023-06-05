import { useQueryClient } from '@tanstack/react-query';
import { ArticleDto } from '~shared/api/realworld';
import { useUnfavoriteArticle } from '../../api/unfavoriteArticle';

type UnfavoriteArticleButtonProps = {
  queryKey: string[];
  article: ArticleDto;
};

export function UnfavoriteArticleButton(props: UnfavoriteArticleButtonProps) {
  const { article, queryKey } = props;

  const queryClient = useQueryClient();

  const unfavoriteArticle = useUnfavoriteArticle(queryKey, queryClient);

  const handleUnfavorite = async () => {
    await unfavoriteArticle.mutateAsync(article);
  };

  return (
    <button
      className="btn btn-primary btn-sm pull-xs-right"
      type="button"
      onClick={handleUnfavorite}
    >
      <i className="ion-heart" /> {article.favoritesCount}
    </button>
  );
}

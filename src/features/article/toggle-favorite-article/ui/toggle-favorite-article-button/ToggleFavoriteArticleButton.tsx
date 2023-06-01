import { conduitApi } from '~shared/api';
// FIXME: crossimport!
import { FavoriteArticleButton } from '../../../favorite-article';
import { UnfavoriteArticleButton } from '../../../unfavorite-article';

type ToggleFavoriteArticleButtonProps = {
  queryKey: string[];
  article: conduitApi.ArticleDto;
};

export function ToggleFavoriteArticleButton(
  props: ToggleFavoriteArticleButtonProps,
) {
  const { queryKey, article } = props;

  return article.favorited ? (
    <UnfavoriteArticleButton queryKey={queryKey} article={article} />
  ) : (
    <FavoriteArticleButton queryKey={queryKey} article={article} />
  );
}

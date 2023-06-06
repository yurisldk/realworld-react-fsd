import { ReactNode } from 'react';
import { ArticleDto } from '~shared/api/realworld';
import { FavoriteArticleButton } from '../../../favorite-article';
import { UnfavoriteArticleButton } from '../../../unfavorite-article';

type ToggleFavoriteArticleButtonProps = {
  queryKey: unknown[];
  article: ArticleDto;
  followTitle?: ReactNode;
  unfollowTitle?: ReactNode;
  float?: 'none' | 'left' | 'right';
};

export function ToggleFavoriteArticleButton(
  props: ToggleFavoriteArticleButtonProps,
) {
  const { queryKey, article, followTitle, unfollowTitle, float } = props;

  return article.favorited ? (
    <UnfavoriteArticleButton
      queryKey={queryKey}
      article={article}
      title={unfollowTitle}
      float={float}
    />
  ) : (
    <FavoriteArticleButton
      queryKey={queryKey}
      article={article}
      title={followTitle}
      float={float}
    />
  );
}

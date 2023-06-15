import { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FavoriteButton } from '~entities/article';
import { ArticleDto } from '~shared/api/realworld';
import { useMutationFavoriteArticle } from '../../model/favoriteArticle';

type FavoriteArticleButtonProps = {
  article: ArticleDto;
  title?: ReactNode;
  float?: 'none' | 'left' | 'right';
};

export function FavoriteArticleButton(props: FavoriteArticleButtonProps) {
  const { article, title, float = 'none' } = props;

  const queryClient = useQueryClient();

  const favoriteArticle = useMutationFavoriteArticle(queryClient);

  const handleFavorite = async () => {
    const newArticle: ArticleDto = {
      ...article,
      favorited: true,
      favoritesCount: article.favoritesCount + 1,
    };
    favoriteArticle.mutate(newArticle);
  };

  return (
    <FavoriteButton title={title} float={float} onClick={handleFavorite} />
  );
}

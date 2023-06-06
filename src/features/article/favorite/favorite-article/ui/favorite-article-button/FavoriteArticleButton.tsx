import { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FavoriteButton } from '~entities/article';
import { ArticleDto } from '~shared/api/realworld';
import { useMutationFavoriteArticle } from '../../model/favoriteArticle';

type FavoriteArticleButtonProps = {
  queryKey: unknown[];
  article: ArticleDto;
  title?: ReactNode;
  float?: 'none' | 'left' | 'right';
};

export function FavoriteArticleButton(props: FavoriteArticleButtonProps) {
  const { queryKey, article, title, float = 'none' } = props;

  const queryClient = useQueryClient();

  const favoriteArticle = useMutationFavoriteArticle(queryKey, queryClient);

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

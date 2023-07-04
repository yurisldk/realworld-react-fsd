import { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IoHeart } from 'react-icons/io5';
import { ArticleDto } from '~shared/api/realworld';
import { Button } from '~shared/ui/button';
import { useMutationFavoriteArticle } from '../../api/favoriteArticle';

type FavoriteArticleButtonProps = {
  article: ArticleDto;
  className?: string;
  children?: ReactNode;
};

export function FavoriteArticleButton(props: FavoriteArticleButtonProps) {
  const { article, className, children } = props;

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
    <Button
      color="primary"
      variant="outline"
      className={className}
      onClick={handleFavorite}
    >
      <IoHeart size={16} />
      {children}
    </Button>
  );
}

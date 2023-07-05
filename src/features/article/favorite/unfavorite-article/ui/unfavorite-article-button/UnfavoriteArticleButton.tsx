import { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IoHeart } from 'react-icons/io5';
import { articleApi } from '~entities/article';
import { Button } from '~shared/ui/button';
import { useMutationUnfavoriteArticle } from '../../api/unfavoriteArticle';

type UnfavoriteArticleButtonProps = {
  article: articleApi.Article;
  className?: string;
  children?: ReactNode;
};

export function UnfavoriteArticleButton(props: UnfavoriteArticleButtonProps) {
  const { article, className, children } = props;

  const queryClient = useQueryClient();

  const unfavoriteArticle = useMutationUnfavoriteArticle(queryClient);

  const handleUnfavorite = () => {
    const newArticle: articleApi.Article = {
      ...article,
      favorited: false,
      favoritesCount: article.favoritesCount - 1,
    };
    unfavoriteArticle.mutate(newArticle);
  };

  return (
    <Button className={className} onClick={handleUnfavorite}>
      <IoHeart size={16} />
      {children}
    </Button>
  );
}

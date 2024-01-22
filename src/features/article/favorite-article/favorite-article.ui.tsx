import { IoHeart } from 'react-icons/io5';
import { articleTypes } from '~entities/article';
import { Button } from '~shared/ui/button';
import { useFavoriteArticleMutation } from './favorite-article.model';

type FavoriteArticleButtonProps = {
  article: articleTypes.Article;
  short?: boolean;
};

export function FavoriteArticleButton(props: FavoriteArticleButtonProps) {
  const { article, short = false } = props;

  const { mutate: favoriteArticle } = useFavoriteArticleMutation(article);

  const handleFavorite = () => {
    favoriteArticle(article.slug);
  };

  return (
    <Button color="primary" variant="outline" onClick={handleFavorite}>
      <IoHeart size={16} />
      {short ? (
        article.favoritesCount
      ) : (
        <>
          &nbsp;Favorite Article&nbsp;
          <span className="counter">({article.favoritesCount})</span>
        </>
      )}
    </Button>
  );
}

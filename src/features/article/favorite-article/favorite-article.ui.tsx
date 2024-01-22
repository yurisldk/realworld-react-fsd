import { IoHeart } from 'react-icons/io5';
import { articleQueries, articleTypes } from '~entities/article';
import { Button } from '~shared/ui/button';

type FavoriteArticleButtonProps = {
  article: articleTypes.Article;
  short?: boolean;
};

export function FavoriteArticleButton(props: FavoriteArticleButtonProps) {
  const { article, short = false } = props;

  const { mutate: favoriteArticle } = articleQueries.useFavoriteArticleMutation(
    article.slug,
  );

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

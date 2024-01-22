import { IoHeart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { articleQueries, articleTypes } from '~entities/article';
import { sessionModel } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';

type FavoriteArticleButtonProps = {
  article: articleTypes.Article;
  short?: boolean;
};

export function FavoriteArticleButton(props: FavoriteArticleButtonProps) {
  const { article, short = false } = props;

  const navigate = useNavigate();

  const { mutate: favoriteArticle } = articleQueries.useFavoriteArticleMutation(
    article.slug,
  );

  const handleFavorite = () => {
    if (sessionModel.hasToken()) {
      favoriteArticle({ slug: article.slug });
      return;
    }
    navigate(pathKeys.login());
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

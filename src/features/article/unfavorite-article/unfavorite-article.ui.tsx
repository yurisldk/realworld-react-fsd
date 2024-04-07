import { IoHeart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { articleQueries, articleTypes } from '~entities/article';
import { pathKeys } from '~shared/lib/react-router';
import { sessionService } from '~shared/session';
import { Button } from '~shared/ui/button';

type UnfavoriteArticleButtonProps = {
  article: articleTypes.Article;
  short?: boolean;
};

export function UnfavoriteArticleButton(props: UnfavoriteArticleButtonProps) {
  const { article, short = false } = props;

  const navigate = useNavigate();

  const { mutate: unfavoriteArticle } =
    articleQueries.useUnfavoriteArticleMutation(article.slug);

  const handleFavorite = () => {
    if (sessionService.hasToken()) {
      unfavoriteArticle({ slug: article.slug });
      return;
    }
    navigate(pathKeys.login());
  };

  return (
    <Button color="primary" onClick={handleFavorite}>
      <IoHeart size={16} />
      {short ? (
        article.favoritesCount
      ) : (
        <>
          &nbsp;Unfavorite Article&nbsp;
          <span className="counter">({article.favoritesCount})</span>
        </>
      )}
    </Button>
  );
}

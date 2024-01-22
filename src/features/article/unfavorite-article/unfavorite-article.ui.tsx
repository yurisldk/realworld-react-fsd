import { IoHeart } from 'react-icons/io5';
import { articleQueries, articleTypes } from '~entities/article';
import { Button } from '~shared/ui/button';

type UnfavoriteArticleButtonProps = {
  article: articleTypes.Article;
  short?: boolean;
};

export function UnfavoriteArticleButton(props: UnfavoriteArticleButtonProps) {
  const { article, short = false } = props;

  const { mutate: unfavoriteArticle } =
    articleQueries.useUnfavoriteArticleMutation(article.slug);

  const handleFavorite = () => {
    unfavoriteArticle(article.slug);
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

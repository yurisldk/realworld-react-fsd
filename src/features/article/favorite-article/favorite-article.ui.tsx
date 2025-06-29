import { IoHeart } from 'react-icons/io5';
import { Button } from '~shared/ui/button/button.ui';
import { Article } from '~entities/article/article.types';
import { useFavoriteArticleMutation } from './favorite-article.mutation';

export function FavoriteArticleBriefButton(props: { article: Article }) {
  const { article } = props;

  const { mutate } = useFavoriteArticleMutation({ mutationKey: [article.slug] });

  const handleFavorite = () => {
    mutate(article.slug);
  };

  return (
    <Button color="primary" variant="outline" onClick={handleFavorite}>
      <IoHeart size={16} />
      {article.favoritesCount}
    </Button>
  );
}

export function FavoriteArticleExtendedButton(props: { article: Article }) {
  const { article } = props;

  const { mutate } = useFavoriteArticleMutation({ mutationKey: [article.slug] });

  const handleFavorite = () => {
    mutate(article.slug);
  };

  return (
    <Button color="primary" variant="outline" onClick={handleFavorite} data-test="favorite-extended-button">
      <IoHeart size={16} />
      &nbsp;Favorite Article&nbsp;
      <span className="counter">({article.favoritesCount})</span>
    </Button>
  );
}

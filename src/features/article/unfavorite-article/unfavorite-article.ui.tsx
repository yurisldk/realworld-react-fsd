import { IoHeart } from 'react-icons/io5';
import { Button } from '~shared/ui/button/button.ui';
import { Article } from '~entities/article/article.types';
import { useUnfavoriteArticleMutation } from './unfavorite-article.mutation';

export function UnfavoriteArticleBriefButton(props: { article: Article }) {
  const { article } = props;

  const { mutate } = useUnfavoriteArticleMutation({ mutationKey: [article.slug] });

  const handleUnfavorite = () => {
    mutate(article.slug);
  };

  return (
    <Button color="primary" onClick={handleUnfavorite}>
      <IoHeart size={16} />
      {article.favoritesCount}
    </Button>
  );
}

export function UnfavoriteArticleExtendedButton(props: { article: Article }) {
  const { article } = props;

  const { mutate } = useUnfavoriteArticleMutation({ mutationKey: [article.slug] });

  const handleUnfavorite = () => {
    mutate(article.slug);
  };

  return (
    <Button color="primary" onClick={handleUnfavorite}>
      <IoHeart size={16} />
      &nbsp;Unfavorite Article&nbsp;
      <span className="counter">({article.favoritesCount})</span>
    </Button>
  );
}

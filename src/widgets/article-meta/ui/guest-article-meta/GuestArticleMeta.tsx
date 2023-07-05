import { IoAdd, IoHeart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { ArticleMeta, articleApi } from '~entities/article';
import { PATH_PAGE } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';

type GuestArticleMetaProps = {
  article: articleApi.Article;
};

export function GuestArticleMeta(props: GuestArticleMetaProps) {
  const { article } = props;

  const navigate = useNavigate();

  const onButtonClick = () => navigate(PATH_PAGE.login);

  return (
    <ArticleMeta
      article={article}
      actionSlot={
        <>
          <Button
            color="secondary"
            variant="outline"
            className="action-btn"
            onClick={onButtonClick}
          >
            <IoAdd size={16} />
            &nbsp; Follow {article.author.username}
          </Button>
          &nbsp;&nbsp;
          <Button color="primary" variant="outline" onClick={onButtonClick}>
            <IoHeart size={16} />
            &nbsp;Favorite Article&nbsp;
            <span className="counter">({article.favoritesCount})</span>
          </Button>
        </>
      }
    />
  );
}

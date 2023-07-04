import { IoHeart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { ArticleMeta } from '~entities/article';
import { FollowButton } from '~entities/profile';
import { ArticleDto } from '~shared/api/realworld';
import { PATH_PAGE } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';

type GuestArticleMetaProps = {
  article: ArticleDto;
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
          <FollowButton
            title={article.author.username}
            onClick={onButtonClick}
          />
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

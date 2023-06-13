import { useNavigate } from 'react-router-dom';
import { ArticleMeta, FavoriteButton } from '~entities/article';
import { FollowButton } from '~entities/profile';
import { ArticleDto } from '~shared/api/realworld';
import { PATH_PAGE } from '~shared/lib/react-router';

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
          <FavoriteButton
            title={
              <>
                &nbsp; Favorite Article{' '}
                <span className="counter">({article.favoritesCount})</span>
              </>
            }
            onClick={onButtonClick}
          />
        </>
      }
    />
  );
}

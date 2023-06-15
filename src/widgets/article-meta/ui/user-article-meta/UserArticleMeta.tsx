import { ArticleMeta } from '~entities/article';
import { ToggleFavoriteArticleButton } from '~features/article';
import { ToggleFollowButton } from '~features/profile';
import { ArticleDto } from '~shared/api/realworld';

type UserArticleMetaProps = {
  article: ArticleDto;
};

export function UserArticleMeta(props: UserArticleMetaProps) {
  const { article } = props;

  return (
    <ArticleMeta
      article={article}
      actionSlot={
        <>
          <ToggleFollowButton profile={article.author} />
          &nbsp;&nbsp;
          <ToggleFavoriteArticleButton
            article={article}
            followTitle={
              <>
                &nbsp; Favorite Article{' '}
                <span className="counter">({article.favoritesCount})</span>
              </>
            }
            unfollowTitle={
              <>
                &nbsp; Unfavorite Article{' '}
                <span className="counter">({article.favoritesCount})</span>
              </>
            }
          />
        </>
      }
    />
  );
}

import { ArticleMeta, articleApi } from '~entities/article';
import {
  UnfavoriteArticleButton,
  FavoriteArticleButton,
} from '~features/article';
import { UnfollowUserButton, FollowUserButton } from '~features/profile';

type UserArticleMetaProps = {
  article: articleApi.Article;
};

export function UserArticleMeta(props: UserArticleMetaProps) {
  const { article } = props;

  return (
    <ArticleMeta
      article={article}
      actionSlot={
        <>
          {article.author.following ? (
            <UnfollowUserButton profile={article.author} />
          ) : (
            <FollowUserButton profile={article.author} />
          )}
          &nbsp;&nbsp;
          {article.favorited ? (
            <UnfavoriteArticleButton article={article}>
              &nbsp;Unfavorite Article&nbsp;
              <span className="counter">({article.favoritesCount})</span>
            </UnfavoriteArticleButton>
          ) : (
            <FavoriteArticleButton article={article}>
              &nbsp; Favorite Article&nbsp;
              <span className="counter">({article.favoritesCount})</span>
            </FavoriteArticleButton>
          )}
        </>
      }
    />
  );
}

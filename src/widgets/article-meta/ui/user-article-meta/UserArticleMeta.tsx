import { ArticleMeta, articleApi } from '~entities/article';
import { ToggleFavoriteArticleButton } from '~features/article';
import { ToggleFollowButton } from '~features/profile';
import { ArticleDto } from '~shared/api/realworld';

type UserArticleMetaProps = {
  slug: string;
  article: ArticleDto;
};

export function UserArticleMeta(props: UserArticleMetaProps) {
  const { slug, article } = props;

  const queryArticleKey = articleApi.articleKeys.article.slug(slug);

  return (
    <ArticleMeta
      article={article}
      actionSlot={
        <>
          <ToggleFollowButton
            queryKey={queryArticleKey}
            profile={article.author}
          />
          &nbsp;&nbsp;
          <ToggleFavoriteArticleButton
            queryKey={queryArticleKey}
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

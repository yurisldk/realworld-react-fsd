import { ArticleMeta, articleApi } from '~entities/article';
import { profileApi } from '~entities/profile';
import { ToggleFavoriteArticleButton } from '~features/article';
import { ToggleFollowButton } from '~features/profile';
import { ArticleDto } from '~shared/api/realworld';

type ProfileArticleMetaProps = {
  slug: string;
  article: ArticleDto;
};

export function ProfileArticleMeta(props: ProfileArticleMetaProps) {
  const { slug, article } = props;

  const queryArticleKey = articleApi.articleKeys.article.slug(slug);
  const queryProfileKey = profileApi.profileKeys.profile.username(
    article.author.username,
  );

  return (
    <ArticleMeta
      article={article}
      actionSlot={
        <>
          <ToggleFollowButton
            queryKey={queryProfileKey}
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

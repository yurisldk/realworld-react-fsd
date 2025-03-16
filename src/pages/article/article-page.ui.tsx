import { ReactNode, Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { IoAdd, IoHeart, IoPencil } from 'react-icons/io5';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { Button } from '~shared/ui/button/button.ui';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { articleQueryOptions } from '~entities/article/article.api';
import { Article } from '~entities/article/article.types';
import { Profile } from '~entities/profile/profie.types';
import { DeleteArticleButton } from '~features/article/delete-article/delete-article.ui';
import { FavoriteArticleExtendedButton } from '~features/article/favorite-article/favorite-article.ui';
import { UnfavoriteArticleExtendedButton } from '~features/article/unfavorite-article/unfavorite-article.ui';
import { useCanPerformAction } from '~features/permission/permission.service';
import { FollowUserButton } from '~features/profile/follow-profile/follow-profile.ui';
import { UnfollowUserButton } from '~features/profile/unfollow-profile/unfollow-profile.ui';
import { CommentsFeed } from '~widgets/comments-feed/comments-feed.ui';
import { ArticleLoaderArgs } from './article-page.loader';
import { ArticlePageSkeleton } from './article-page.skeleton';

export default function ArticlePage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<ArticlePageSkeleton />}>
        <BaseArticlePage />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseArticlePage() {
  const { params } = useLoaderData() as ArticleLoaderArgs;
  const { slug } = params;

  const { data: article } = useSuspenseQuery(articleQueryOptions(slug));

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta article={article} actions={<ArticleActions article={article} />} />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div>
              <p>{article.body}</p>
            </div>
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleMeta article={article} actions={<ArticleActions article={article} />} />
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <CommentsFeed slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleMeta(props: { article: Article; actions?: ReactNode }) {
  const { article, actions } = props;

  const { author, updatedAt } = article;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <div className="article-meta">
      <Link to={pathKeys.profile.byUsername(author.username)}>
        <img src={author.image} alt={author.username} />
      </Link>
      <div className="info">
        <Link className="author" to={pathKeys.profile.byUsername(author.username)}>
          {author.username}
        </Link>
        <span className="date">{formattedDate}</span>
      </div>
      {actions}
    </div>
  );
}

function ArticleActions(props: { article: Article }) {
  const { article } = props;
  const { author } = article;
  const { username } = author;

  const canUpdateArticle = useCanPerformAction('update', 'article', {
    articleAuthorId: username,
  });

  const canDeleteArticle = useCanPerformAction('delete', 'article', {
    articleAuthorId: username,
  });

  return (
    <>
      {canUpdateArticle && <EditArticleLink slug={article.slug} />}
      {!canUpdateArticle && <ToggleFollowProfile profile={author} />}
      &nbsp;
      {canDeleteArticle && <DeleteArticleButton slug={article.slug} />}
      {!canDeleteArticle && <ToggleFavoriteArticle article={article} />}
    </>
  );
}

function ToggleFollowProfile(props: { profile: Profile }) {
  const { profile } = props;
  const { following, username } = profile;

  const canFollowProfile = useCanPerformAction('follow', 'profile');
  const canUnfollowProfile = useCanPerformAction('unfollow', 'profile');
  const cannotFollowOrUnfollow = !canFollowProfile || !canUnfollowProfile;

  const canFollow = canFollowProfile && !following;
  const canUnfollow = canUnfollowProfile && following;

  return (
    <>
      {canFollow && <FollowUserButton username={username} />}
      {canUnfollow && <UnfollowUserButton username={username} />}
      {cannotFollowOrUnfollow && <NavigateToLoginButtonFollow username={profile.username} />}
    </>
  );
}

function ToggleFavoriteArticle(props: { article: Article }) {
  const { article } = props;
  const { favorited } = article;

  const canLikeArticle = useCanPerformAction('like', 'article');
  const canDislikeArticle = useCanPerformAction('dislike', 'article');
  const cannotLikeOrDislike = !canLikeArticle || !canDislikeArticle;

  const canLike = canLikeArticle && !favorited;
  const canDislike = canDislikeArticle && favorited;

  return (
    <>
      {canLike && <FavoriteArticleExtendedButton article={article} />}
      {canDislike && <UnfavoriteArticleExtendedButton article={article} />}
      {cannotLikeOrDislike && <NavigateToLoginButtonFavorite favoritesCount={article.favoritesCount} />}
    </>
  );
}

function EditArticleLink(props: { slug: string }) {
  const { slug } = props;

  return (
    <Link className="btn btn-outline-secondary btn-sm" to={pathKeys.editor.bySlug(slug)}>
      <IoPencil size={16} />
      Edit Article
    </Link>
  );
}

function NavigateToLoginButtonFollow(props: { username: string }) {
  const { username } = props;

  const navigate = useNavigate();

  const onClick = () => navigate(pathKeys.login);

  return (
    <Button color="secondary" variant="outline" className="action-btn " onClick={onClick}>
      <IoAdd size={16} />
      &nbsp; Follow {username}
    </Button>
  );
}

function NavigateToLoginButtonFavorite(props: { favoritesCount: number }) {
  const { favoritesCount } = props;

  const navigate = useNavigate();

  const onClick = () => navigate(pathKeys.login);

  return (
    <Button color="primary" variant="outline" onClick={onClick}>
      <IoHeart size={16} />
      &nbsp;Favorite Article&nbsp;
      <span className="counter">({favoritesCount})</span>
    </Button>
  );
}

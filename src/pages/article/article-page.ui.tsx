import { useSuspenseQueries } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { withErrorBoundary } from 'react-error-boundary';
import { IoPencil } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import { articleQueries, articleTypes } from '~entities/article';
import { profileTypes } from '~entities/profile';
import { sessionQueries } from '~entities/session';
import {
  DeleteArticleButton,
  FavoriteArticleButton,
  UnfavoriteArticleButton,
} from '~features/article';
import { FollowUserButton, UnfollowUserButton } from '~features/profile';
import { withSuspense } from '~shared/lib/react';
import { pathKeys, routerTypes } from '~shared/lib/react-router';
import { ErrorHandler } from '~shared/ui/error';
import { Loader } from '~shared/ui/loader';
import { CommentsList } from '~widgets/comments-list';
import { CreateCommentForm } from '~widgets/create-comment-form';

function Page() {
  const { slug } = useParams() as routerTypes.SlugPageParams;

  const [user, article] = useSuspenseQueries({
    queries: [
      sessionQueries.userService.queryOptions(),
      articleQueries.articleService.queryOptions(slug),
    ],
  });

  const isOwner = user.data?.username === article.data.author.username;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.data.title}</h1>
          <ArticleMeta article={article.data} isOwner={isOwner} />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div>
              <p>{article.data.body}</p>
            </div>
            <ul className="tag-list">
              {article.data.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleMeta article={article.data} isOwner={isOwner} />
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <CreateCommentForm />
            <CommentsList />
          </div>
        </div>
      </div>
    </div>
  );
}

type ArticleMetaProps = { article: articleTypes.Article; isOwner: boolean };
function ArticleMeta(props: ArticleMetaProps) {
  return (
    <div className="article-meta">
      <Link
        to={pathKeys.profile.byUsername({
          username: props.article.author.username,
        })}
      >
        <img
          src={props.article.author.image}
          alt={props.article.author.username}
        />
      </Link>
      <div className="info">
        <Link
          className="author"
          to={pathKeys.profile.byUsername({
            username: props.article.author.username,
          })}
        >
          {props.article.author.username}
        </Link>
        <span className="date">
          {dayjs(props.article.updatedAt).format('MMMM D, YYYY')}
        </span>
      </div>
      <ArticleActions article={props.article} isOwner={props.isOwner} />
    </div>
  );
}

type ArticleActionsProps = { article: articleTypes.Article; isOwner: boolean };
function ArticleActions(props: ArticleActionsProps) {
  return props.isOwner ? (
    <AuthorActions slug={props.article.slug} />
  ) : (
    <UserActions article={props.article} />
  );
}

type UserActionsProps = { article: articleTypes.Article };
function UserActions(props: UserActionsProps) {
  return (
    <>
      <FollowProfileActionButtons profile={props.article.author} />
      &nbsp;
      <FavoriteArticleActionButtons article={props.article} />
    </>
  );
}

type AuthorActionsProps = { slug: string };
function AuthorActions(props: AuthorActionsProps) {
  return (
    <>
      <Link
        className="btn btn-outline-secondary btn-sm"
        to={pathKeys.editor.bySlug({ slug: props.slug })}
      >
        <IoPencil size={16} />
        Edit Article
      </Link>
      &nbsp;
      <DeleteArticleButton slug={props.slug} />
    </>
  );
}

type FavoriteArticleActionButtonsProps = { article: articleTypes.Article };
function FavoriteArticleActionButtons(
  props: FavoriteArticleActionButtonsProps,
) {
  return props.article.favorited ? (
    <UnfavoriteArticleButton article={props.article} />
  ) : (
    <FavoriteArticleButton article={props.article} />
  );
}

type FollowProfileActionButtonsProps = { profile: profileTypes.Profile };
function FollowProfileActionButtons(props: FollowProfileActionButtonsProps) {
  return props.profile.following ? (
    <UnfollowUserButton profile={props.profile} />
  ) : (
    <FollowUserButton profile={props.profile} />
  );
}

const SuspensedPage = withSuspense(Page, {
  fallback: <Loader />,
});
export const ArticlePage = withErrorBoundary(SuspensedPage, {
  fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});

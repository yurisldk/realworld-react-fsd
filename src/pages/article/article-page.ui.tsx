import { useQueries } from '@tanstack/react-query';
import dayjs from 'dayjs';
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
import { pathKeys, routerTypes } from '~shared/lib/react-router';
import { ErrorHandler } from '~shared/ui/error';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { Spinner } from '~shared/ui/spinner';
import { CommentsList } from '~widgets/comments-list';
import { CreateCommentForm } from '~widgets/create-comment-form';

export function ArticlePage() {
  const { slug } = useParams() as routerTypes.SlugPageParams;

  const [user, article] = useQueries({
    queries: [
      sessionQueries.currentUserQueryOptions(),
      articleQueries.articleQueryOptions(slug),
    ],
  });

  if (article.isPending)
    return (
      <FullPageWrapper>
        <Spinner />
      </FullPageWrapper>
    );

  if (article.isError) {
    return (
      <FullPageWrapper>
        <ErrorHandler error={article.error} />
      </FullPageWrapper>
    );
  }

  const isOwner = user.data.username === article.data.author.username;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.data.title}</h1>
          <ArticleMeta article={article.data} isAuthor={isOwner} />
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
          <ArticleMeta article={article.data} isAuthor={isOwner} />
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

type ArticleMetaProps = { article: articleTypes.Article; isAuthor: boolean };
const ArticleMeta = (props: ArticleMetaProps) => (
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
    <ArticleActions article={props.article} isAuthor={props.isAuthor} />
  </div>
);

type ArticleActionsProps = { article: articleTypes.Article; isAuthor: boolean };
const ArticleActions = (props: ArticleActionsProps) =>
  props.isAuthor ? (
    <AuthorActions slug={props.article.slug} />
  ) : (
    <UserActions article={props.article} />
  );

type UserActionsProps = { article: articleTypes.Article };
const UserActions = (props: UserActionsProps) => (
  <>
    <FollowProfileActionButtons profile={props.article.author} />
    &nbsp;
    <FavoriteArticleActionButtons article={props.article} />
  </>
);

type AuthorActionsProps = { slug: string };
const AuthorActions = (props: AuthorActionsProps) => (
  <>
    <Link
      className="btn btn-outline-secondary btn-sm"
      to={pathKeys.editor.bySlug({ slug: props.slug })}
    >
      <IoPencil size={16} />
      &nbsp;Edit Article
    </Link>
    <DeleteArticleButton slug={props.slug} />
  </>
);

type FavoriteArticleActionButtonsProps = { article: articleTypes.Article };
const FavoriteArticleActionButtons = (
  props: FavoriteArticleActionButtonsProps,
) =>
  props.article.favorited ? (
    <UnfavoriteArticleButton article={props.article} />
  ) : (
    <FavoriteArticleButton article={props.article} />
  );

type FollowProfileActionButtonsProps = { profile: profileTypes.Profile };
const FollowProfileActionButtons = (props: FollowProfileActionButtonsProps) =>
  props.profile.following ? (
    <UnfollowUserButton profile={props.profile} />
  ) : (
    <FollowUserButton profile={props.profile} />
  );

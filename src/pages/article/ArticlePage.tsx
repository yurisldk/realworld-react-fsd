import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { articleApi } from '~entities/article';
import { sessionApi } from '~entities/session';
import { ErrorHandler } from '~shared/ui/error';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { Spinner } from '~shared/ui/spinner';
import {
  GuestArticleMeta,
  CurrentUserArticleMeta,
  UserArticleMeta,
} from '~widgets/article-meta';
import { CommentsList } from '~widgets/comments-list';
import { NewCommentEditor } from '~widgets/new-comment-editor';

export function ArticlePage() {
  const { slug } = useParams()!;

  const { data: user } = useQuery({
    queryKey: sessionApi.CURRENT_USER_KEY,
    queryFn: sessionApi.currentUserQuery,
  });

  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [...articleApi.ARTICLE_KEY, slug],
    queryFn: () => articleApi.articleQuery(slug!),
  });

  if (isLoading)
    return (
      <FullPageWrapper>
        <Spinner />
      </FullPageWrapper>
    );

  if (isError) {
    return (
      <FullPageWrapper>
        <ErrorHandler error={error} />
      </FullPageWrapper>
    );
  }

  const { title, body, tagList, author } = article!;

  const isAuth = Boolean(user);
  const isGuest = !isAuth;
  const isUser = isAuth && !(user!.username === author.username);
  const isCurrentUser = isAuth && user!.username === author.username;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{title}</h1>

          {isCurrentUser && (
            <CurrentUserArticleMeta slug={slug!} article={article!} />
          )}
          {isUser && <UserArticleMeta article={article!} />}

          {isGuest && <GuestArticleMeta article={article!} />}
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div>
              <p>{body}</p>
            </div>
            <ul className="tag-list">
              {tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          {isCurrentUser && (
            <CurrentUserArticleMeta slug={slug!} article={article!} />
          )}
          {isUser && <UserArticleMeta article={article!} />}

          {isGuest && <GuestArticleMeta article={article!} />}
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <NewCommentEditor slug={slug!} />
            <CommentsList slug={slug!} />
          </div>
        </div>
      </div>
    </div>
  );
}

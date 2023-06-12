import { useParams } from 'react-router-dom';
import { articleApi } from '~entities/article';
import { sessionModel } from '~entities/session';
import { ErrorHandler } from '~shared/ui/error-handler';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { Spinner } from '~shared/ui/spinner';
import { CommentsList } from '~widgets/comments-list';
import { NewCommentEditor } from '~widgets/new-comment-editor';
import { ProfileArticleMeta } from '~widgets/profile-article-meta';
import { UserArticleMeta } from '~widgets/user-article-meta';

export function ArticlePage() {
  const { slug } = useParams();

  const isAuth = sessionModel.useAuth();

  const {
    data: article,
    isLoading,
    isError,
    error,
  } = articleApi.useArticle(slug!, { secure: isAuth });

  if (isLoading)
    return (
      <FullPageWrapper>
        <Spinner />
      </FullPageWrapper>
    );

  if (isError)
    return (
      <FullPageWrapper>
        <ErrorHandler errorData={error} />
      </FullPageWrapper>
    );

  const { title, body, tagList } = article;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{title}</h1>

          {!isAuth && <ProfileArticleMeta slug={slug!} article={article} />}
          {isAuth && <UserArticleMeta slug={slug!} article={article} />}
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
          {!isAuth && <ProfileArticleMeta slug={slug!} article={article} />}
          {isAuth && <UserArticleMeta slug={slug!} article={article} />}
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

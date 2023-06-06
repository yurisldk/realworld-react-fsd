import { useParams } from 'react-router-dom';
import { articleApi } from '~entities/article';
import { sessionModel } from '~entities/session';
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
  } = articleApi.useArticle(slug!, { secure: isAuth });

  if (isLoading) return <div>loading</div>;
  if (isError) return <div>error</div>;

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

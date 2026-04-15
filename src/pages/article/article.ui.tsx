import { Suspense } from 'react';
import { IoAdd, IoCreateOutline, IoHeart, IoRemove, IoTrash } from 'react-icons/io5';
import { Await, Link, useFetcher, useLoaderData, useParams } from 'react-router';
import type { MultipleCommentsResponse } from '~shared/api/generated/schemas/multipleCommentsResponse.zod';
import type { SingleArticleResponse } from '~shared/api/generated/schemas/singleArticleResponse.zod';
import { formatDate } from '~shared/lib/date';
import { AsyncErrorCard } from '~shared/ui/async-error-card/async-error-card.ui';
import { ErrorMessages } from '~shared/ui/error-messages/error-messages.ui';
import { Spinner } from '~shared/ui/spinner/spinner.ui';
import type { CommentCreateActionData } from './actions/comment-create.action';
import type { ArticlePageLoaderData } from './article.loader';
import { articlePaths } from './article.paths';

export function ArticlePage() {
  return (
    <div className="article-page">
      <ArticleView />
      <ArticleComments />
    </div>
  );
}

function ArticleView() {
  const { articlePromise } = useLoaderData<ArticlePageLoaderData>();

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={articlePromise} errorElement={<ArticleContentError />}>
        {(articleData) => <ArticleContent article={articleData.article} />}
      </Await>
    </Suspense>
  );
}

type ArticleContentProps = {
  article: SingleArticleResponse['article'];
};

function ArticleContent({ article }: ArticleContentProps) {
  const { title, body, tagList } = article;

  return (
    <>
      <div className="banner">
        <div className="container">
          <h1>{title}</h1>
          <ArticleActionsBlock article={article} />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{body}</p>
            {tagList.length > 0 && (
              <ul className="tag-list">
                {tagList.map((tag) => (
                  <li key={tag} className="tag-default tag-pill tag-outline">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleActionsBlock article={article} />
        </div>
      </div>
    </>
  );
}

type ArticleActionsBlockProps = {
  article: SingleArticleResponse['article'];
};

function ArticleActionsBlock({ article }: ArticleActionsBlockProps) {
  const { userData } = useLoaderData<ArticlePageLoaderData>();

  const { createdAt, favorited, favoritesCount = 0, author } = article;
  const { username, following, image } = author;
  const isAuthor = userData?.user?.username === username;

  return (
    <div className="article-meta">
      <Link to={`/profile/${username}`}>
        <img src={image} alt={username} />
      </Link>
      <div className="info">
        <Link to={`/profile/${username}`} className="author">
          {username}
        </Link>
        <span className="date">{formatDate(createdAt)}</span>
      </div>
      {!isAuthor && (
        <>
          <FollowAuthorButton username={username} following={following} />
          &nbsp;
          <FavoriteArticleButton favorited={favorited} favoritesCount={favoritesCount} />
        </>
      )}
      {isAuthor && (
        <>
          <EditArticleButton />
          &nbsp;
          <DeleteArticleButton />
        </>
      )}
    </div>
  );
}

type FollowAuthorButtonProps = {
  username: string;
  following: boolean;
};

function FollowAuthorButton({ username, following }: FollowAuthorButtonProps) {
  const { slug = '' } = useParams();
  const followToggleFetcher = useFetcher({ key: `article-follow-toggle-${slug}-${username}` });
  const optimisticOperation = followToggleFetcher.formData?.get('operation');

  let isFollowing = following;

  if (optimisticOperation === 'follow') {
    isFollowing = true;
  }

  if (optimisticOperation === 'unfollow') {
    isFollowing = false;
  }

  const handleFollowToggle = () => {
    const operation = isFollowing ? 'unfollow' : 'follow';
    const formData = new FormData();
    formData.set('operation', operation);
    formData.set('username', username);
    followToggleFetcher.submit(formData, { action: articlePaths.getFollowTogglePath(slug), method: 'post' });
  };

  return (
    <button
      type="button"
      onClick={handleFollowToggle}
      aria-label={isFollowing ? 'Unfollow author' : 'Follow author'}
      className={isFollowing ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-outline-secondary'}
    >
      {isFollowing ? <IoRemove size={16} /> : <IoAdd size={16} />}
      &nbsp; {isFollowing ? 'Unfollow' : 'Follow'} {username}
    </button>
  );
}

type FavoriteArticleButtonProps = {
  favorited: boolean;
  favoritesCount: number;
};

function FavoriteArticleButton({ favorited, favoritesCount }: FavoriteArticleButtonProps) {
  const { slug = '' } = useParams();

  const favoriteToggleFetcher = useFetcher({ key: `article-favorite-toggle-${slug}` });
  const optimisticOperation = favoriteToggleFetcher.formData?.get('operation');

  let isFavorited = favorited;

  if (optimisticOperation === 'favorite') {
    isFavorited = true;
  }

  if (optimisticOperation === 'unfavorite') {
    isFavorited = false;
  }

  const optimisticFavoritesCount = favoritesCount + Number(isFavorited) - Number(favorited);

  const handleFavoriteToggle = () => {
    const operation = isFavorited ? 'unfavorite' : 'favorite';
    const formData = new FormData();
    formData.set('operation', operation);
    favoriteToggleFetcher.submit(formData, { action: articlePaths.getFavoriteTogglePath(slug), method: 'post' });
  };

  return (
    <button
      type="button"
      onClick={handleFavoriteToggle}
      aria-label={isFavorited ? 'Unfavorite article' : 'Favorite article'}
      className={isFavorited ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline-primary'}
    >
      <IoHeart size={16} />
      &nbsp;{isFavorited ? 'Unfavorite' : 'Favorite'}&nbsp;Post&nbsp;
      <span className="counter">({Math.max(0, optimisticFavoritesCount)})</span>
    </button>
  );
}

function EditArticleButton() {
  const { slug = '' } = useParams();

  return (
    <Link to={`/editor/${slug}`} className="btn btn-sm btn-outline-secondary">
      <IoCreateOutline size={16} /> Edit Article
    </Link>
  );
}

function DeleteArticleButton() {
  const { slug = '' } = useParams();

  const deleteArticleFetcher = useFetcher({ key: `article-delete-${slug}` });
  const deleteArticlePending = deleteArticleFetcher.state !== 'idle';

  const handleDeleteArticle = () => {
    deleteArticleFetcher.submit(null, { action: articlePaths.getDeletePath(slug), method: 'delete' });
  };

  return (
    <button
      type="button"
      onClick={handleDeleteArticle}
      disabled={deleteArticlePending}
      className="btn btn-sm btn-outline-danger"
    >
      <IoTrash size={16} /> Delete Article
    </button>
  );
}

function ArticleComments() {
  const { commentsPromise } = useLoaderData<ArticlePageLoaderData>();

  return (
    <div className="container page">
      <div className="row">
        <Suspense fallback={<Spinner />}>
          <Await resolve={commentsPromise} errorElement={<CommentsListError />}>
            {(commentsData) => <CommentsList commentsData={commentsData} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

type CommentsListProps = {
  commentsData: MultipleCommentsResponse;
};

function CommentsList({ commentsData }: CommentsListProps) {
  const { slug = '' } = useParams();
  const { userData } = useLoaderData<ArticlePageLoaderData>();
  const currentUser = userData?.user ?? null;

  return (
    <div className="col-xs-12 col-md-8 offset-md-2">
      {currentUser && <CreateCommentForm />}
      {!currentUser && (
        <p>
          <Link to="/login">Sign in</Link> or <Link to="/register">sign up</Link> to add comments.
        </p>
      )}

      {commentsData.comments.map(({ id, body, author, createdAt }) => (
        <div key={id} className="card" data-test="comment-item">
          <div className="card-block">
            <p className="card-text">{body}</p>
          </div>
          <div className="card-footer">
            <Link to={`/profile/${author.username}`} className="comment-author">
              <img src={author.image} className="comment-author-img" alt={author.username} />
            </Link>
            &nbsp;
            <Link to={`/profile/${author.username}`} className="comment-author">
              {author.username}
            </Link>
            <span className="date-posted">{formatDate(createdAt)}</span>
            {currentUser?.username === author.username && <DeleteCommentButton slug={slug} id={id} />}
          </div>
        </div>
      ))}
    </div>
  );
}

type DeleteCommentButtonProps = {
  slug: string;
  id: number;
};

function DeleteCommentButton({ slug, id }: DeleteCommentButtonProps) {
  const deleteCommentFetcher = useFetcher({ key: `comment-delete-${slug}-${id}` });
  const deleteCommentPending = deleteCommentFetcher.state !== 'idle';

  return (
    <deleteCommentFetcher.Form method="DELETE" action={articlePaths.getCommentPath(slug, id)} className="mod-options">
      <button
        type="submit"
        disabled={deleteCommentPending}
        aria-label="Delete comment"
        data-test="comment-delete-button"
      >
        <IoTrash size={16} />
      </button>
    </deleteCommentFetcher.Form>
  );
}

function CreateCommentForm() {
  const { slug = '' } = useParams();
  const { userData } = useLoaderData<ArticlePageLoaderData>();
  const { image, username } = userData!.user;

  const createCommentFetcher = useFetcher<CommentCreateActionData>({ key: `comment-create-${slug}` });
  const createCommentPending = createCommentFetcher.state !== 'idle';
  const formKey = createCommentFetcher.data?.ok ? createCommentFetcher.data.resetKey : 'comment-form';

  return (
    <>
      {createCommentFetcher.data && !createCommentFetcher.data.ok && (
        <ErrorMessages errors={createCommentFetcher.data.errors} />
      )}
      <createCommentFetcher.Form
        key={formKey}
        method="POST"
        action={articlePaths.getCommentsPath(slug)}
        className="card comment-form"
      >
        <div className="card-block">
          <textarea
            className="form-control"
            name="body"
            placeholder="Write a comment..."
            rows={3}
            required
            data-test="comment-input"
          />
        </div>
        <div className="card-footer">
          <img src={image} className="comment-author-img" alt={username} />
          <button
            className="btn btn-sm btn-primary"
            type="submit"
            disabled={createCommentPending}
            data-test="comment-submit"
          >
            Post Comment
          </button>
        </div>
      </createCommentFetcher.Form>
    </>
  );
}

function ArticleContentError() {
  return (
    <div className="article-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-12">
            <AsyncErrorCard title="Could not load article" fallbackMessage="Try again later." />
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentsListError() {
  return (
    <div className="col-xs-12 col-md-8 offset-md-2">
      <AsyncErrorCard title="Could not load comments" fallbackMessage="Try again later." />
    </div>
  );
}

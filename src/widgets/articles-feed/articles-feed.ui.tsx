import { ReactNode, Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { IoHeart } from 'react-icons/io5';
import { Link, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { Button } from '~shared/ui/button/button.ui';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { articlesQueryOptions } from '~entities/article/article.api';
import { Article } from '~entities/article/article.types';
import { FavoriteArticleBriefButton } from '~features/article/favorite-article/favorite-article.ui';
import { BaseLoaderArgs } from '~features/article/filter-article/filter-article.types';
import { UnfavoriteArticleBriefButton } from '~features/article/unfavorite-article/unfavorite-article.ui';
import { useCanPerformAction } from '~features/permission/permission.service';
import { ArticlesFeedSkeleton } from './articles-feed.skeleton';

export function ArticlesFeed() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<ArticlesFeedSkeleton />}>
        <BaseArticlesFeed />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseArticlesFeed() {
  const {
    context: { filterQuery },
  } = useLoaderData() as BaseLoaderArgs;

  const [searchParams, setSearchParams] = useSearchParams();

  const { data } = useSuspenseQuery(articlesQueryOptions(filterQuery));

  const onPageClick = (page: string) => () => {
    searchParams.set('page', page);
    setSearchParams(searchParams);
  };

  return (
    <>
      {Object.values(data.articles || 0).map((article) => (
        <ArticleMeta key={article.slug} article={article} action={<FavoriteArticleAction article={article} />} />
      ))}

      {data.articlesCount === 0 && <div className="article-preview">No articles are here... yet.</div>}

      <ul className="pagination">
        {Array(Math.ceil(data.articlesCount / 10))
          .fill(0)
          .map((_, i) => (i + 1).toString())
          .map((page) => (
            <li key={page} className={`page-item ${page === filterQuery.page ? 'active' : ''}`}>
              <button className="page-link" type="button" onClick={onPageClick(page)}>
                {page}
              </button>
            </li>
          ))}
      </ul>
    </>
  );
}

type ArticleMetaProps = { article: Article; action?: ReactNode };
function ArticleMeta(props: ArticleMetaProps) {
  const { article, action } = props;
  const { author, updatedAt } = article;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <div className="article-preview">
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

        {action}
      </div>

      <Link className="preview-link" to={pathKeys.article.bySlug(article.slug)}>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}

function FavoriteArticleAction(props: { article: Article }) {
  const { article } = props;

  const canLike = useCanPerformAction('like', 'article');
  const canDislike = useCanPerformAction('dislike', 'article');
  const canLikeArticle = canLike && !article.favorited;
  const canDislikeArticle = canDislike && article.favorited;
  const cannotLikeAndDislikeArticle = !canLike && !canDislike;

  return (
    <>
      {canLikeArticle && (
        <div className="pull-xs-right">
          <FavoriteArticleBriefButton article={article} />
        </div>
      )}

      {canDislikeArticle && (
        <div className="pull-xs-right">
          <UnfavoriteArticleBriefButton article={article} />
        </div>
      )}

      {cannotLikeAndDislikeArticle && (
        <div className="pull-xs-right">
          <NavigateToLoginButton favoritesCount={article.favoritesCount} />
        </div>
      )}
    </>
  );
}

function NavigateToLoginButton(props: { favoritesCount: number }) {
  const { favoritesCount } = props;

  const navigate = useNavigate();

  const onClick = () => navigate(pathKeys.login);

  return (
    <Button color="primary" variant="outline" onClick={onClick}>
      <IoHeart size={16} /> {Boolean(favoritesCount) && favoritesCount}
    </Button>
  );
}

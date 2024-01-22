import { ReactNode } from 'react';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { withErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import { StoreApi } from 'zustand';
import { articleModel, articleQueries, articleTypes } from '~entities/article';
import {
  FavoriteArticleButton,
  UnfavoriteArticleButton,
} from '~features/article';
import { withSuspense } from '~shared/lib/react';
import { pathKeys } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';
import { Spinner } from '~shared/ui/spinner';

type ArticlesListProps = {
  filterStore: StoreApi<articleModel.State>;
};

function Foo(props: ArticlesListProps) {
  const {
    data: articles,
    isPending,
    isFetching,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    articleQueries.infinityArticlesService.queryOptions(props.filterStore),
  );

  const isBackgroundUpdating = isFetching && !isFetchingNextPage;
  const isEmpty =
    isSuccess &&
    !hasNextPage &&
    articles.pages.length === 1 &&
    articles.pages[0].length === 0;

  return (
    <>
      <IsPendingState isPending={isPending} />
      <IsEmptyState isEmpty={isEmpty} />
      <IsBackgroundUpdatingState isBackgroundUpdating={isBackgroundUpdating} />

      {isSuccess &&
        articles.pages.map((page) =>
          page.map((article) => (
            <ArticleMeta key={article.slug} article={article} />
          )),
        )}

      {hasNextPage && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            color="primary"
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        </div>
      )}
    </>
  );
}

type ArticleMetaProps = { article: articleTypes.Article };
const ArticleMeta = (props: ArticleMetaProps) => (
  <div className="article-preview">
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
      <FavoriteArticleActionButtons article={props.article} />
    </div>
    <Link
      className="preview-link"
      to={pathKeys.article.bySlug({ slug: props.article.slug })}
    >
      <h1>{props.article.title}</h1>
      <p>{props.article.description}</p>
      <span>Read more...</span>
      <ul className="tag-list">
        {props.article.tagList.map((tag) => (
          <li key={tag} className="tag-default tag-pill tag-outline">
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  </div>
);

type FavoriteArticleActionButtonsProps = { article: articleTypes.Article };
const FavoriteArticleActionButtons = (
  props: FavoriteArticleActionButtonsProps,
) =>
  props.article.favorited ? (
    <div className="pull-xs-right">
      <UnfavoriteArticleButton article={props.article} short />
    </div>
  ) : (
    <div className="pull-xs-right">
      <FavoriteArticleButton article={props.article} short />
    </div>
  );

type ArticlePreviewProps = { children: ReactNode };
const ArticlePreview = (props: ArticlePreviewProps) => (
  <div className="article-preview">{props.children}</div>
);

type IsPendingStateProps = { isPending: boolean };
const IsPendingState = ({ isPending }: IsPendingStateProps) =>
  isPending && <ArticlePreview>Loading articles...</ArticlePreview>;

type IsEmptyStateProps = { isEmpty: boolean };
const IsEmptyState = ({ isEmpty }: IsEmptyStateProps) =>
  isEmpty && <ArticlePreview>No articles are here... yet.</ArticlePreview>;

type IsBackgroundUpdatingStateProps = { isBackgroundUpdating: boolean };
const IsBackgroundUpdatingState = ({
  isBackgroundUpdating,
}: IsBackgroundUpdatingStateProps) =>
  isBackgroundUpdating && (
    <div style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
      <Spinner />
    </div>
  );

const SuspensedArticlesList = withSuspense(Foo, {
  fallback: <div>article list loading..</div>,
});
export const ArticlesList = withErrorBoundary(SuspensedArticlesList, {
  fallbackRender: ({ error }) => <div>{error.message}</div>,
});

import { ReactNode } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useStore } from 'zustand';
import { articleApi, articleTypes } from '~entities/article';
import {
  FavoriteArticleButton,
  FilterByCategoryStore,
  FilterByPageStore,
  UnfavoriteArticleButton,
} from '~features/article';
import { PATH_PAGE } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error';
import { Spinner } from '~shared/ui/spinner';

type ArticlesListProps = {
  filterByCategoryStore: FilterByCategoryStore;
  filterByPageStore: FilterByPageStore;
};

export function ArticlesList(props: ArticlesListProps) {
  const { filterByCategoryStore, filterByPageStore } = props;

  const filterByCategory = useStore(
    filterByCategoryStore,
    (state) => state.filter,
  );

  const filterByPage = useStore(filterByPageStore, (state) => state.filter);

  const isUserFeed = Boolean(filterByCategory.following);

  const {
    data: articles,
    isPending,
    isFetching,
    isSuccess,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: isUserFeed
      ? [...articleApi.ARTICLES_FEED_KEY, filterByCategory]
      : [...articleApi.ARTICLES_KEY, filterByCategory],
    queryFn: ({ pageParam }) =>
      isUserFeed
        ? articleApi.articlesFeedQuery(pageParam)
        : articleApi.articlesQuery({ ...pageParam, ...filterByCategory }),
    initialPageParam: filterByPage,
    getNextPageParam,
  });

  const isBackgroundUpdating = isFetching && !isFetchingNextPage;
  const isEmpty =
    isSuccess &&
    !hasNextPage &&
    articles.pages.length === 1 &&
    articles.pages[0].length === 0;

  return (
    <>
      <IsPendingState isPending={isPending} />
      <IsErrorState error={error} />
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
      <Link to={PATH_PAGE.profile.root(props.article.author.username)}>
        <img
          src={props.article.author.image}
          alt={props.article.author.username}
        />
      </Link>
      <div className="info">
        <Link
          className="author"
          to={PATH_PAGE.profile.root(props.article.author.username)}
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
      to={PATH_PAGE.article.slug(props.article.slug)}
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

type IsErrorStateProps = { error: Error | null };
const IsErrorState = ({ error }: IsErrorStateProps) =>
  error && (
    <ArticlePreview>
      <ErrorHandler error={error} />
    </ArticlePreview>
  );

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

type NextPageParams = { limit: number; offset: number };
const getNextPageParam = <D, P extends NextPageParams>(
  lastPage: D[],
  allPages: D[][],
  lastPageParam: P,
) => {
  if (lastPage.length < lastPageParam.limit || !lastPage.length) {
    return null;
  }

  return {
    limit: lastPageParam.limit,
    offset: allPages.length * lastPageParam.limit,
  };
};

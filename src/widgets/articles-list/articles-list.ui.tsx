import { ReactNode } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';
import { articleApi, articleUi } from '~entities/article';
import {
  FavoriteArticleButton,
  FilterByCategoryStore,
  FilterByPageStore,
  UnfavoriteArticleButton,
} from '~features/article';
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
    queryKey: [...articleApi.ARTICLES_KEY, filterByCategory],
    queryFn: ({ pageParam }) =>
      articleApi.articlesQuery({ ...pageParam, ...filterByCategory }),
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
            <articleUi.PreviewCard
              key={article.slug}
              article={article}
              favoriteAction={
                <UnfavoriteArticleButton
                  className="pull-xs-right"
                  article={article}
                >
                  {article.favoritesCount}
                </UnfavoriteArticleButton>
              }
              unfavoriteAction={
                <FavoriteArticleButton
                  className="pull-xs-right"
                  article={article}
                >
                  {article.favoritesCount}
                </FavoriteArticleButton>
              }
            />
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

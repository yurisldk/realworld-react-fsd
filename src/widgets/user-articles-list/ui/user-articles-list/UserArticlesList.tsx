import { ReactNode } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  articleApi,
  ArticleMeta,
  ArticlePreviewCard,
  articleTypes,
} from '~entities/article';
import {
  UnfavoriteArticleButton,
  FavoriteArticleButton,
} from '~features/article';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error';

type UserArticlesListProps = { query: articleTypes.ArticlesFeedQueryDto };

export function UserArticlesList(props: UserArticlesListProps) {
  const { query } = props;

  const {
    data: articles,
    isLoading,
    isError,
    isSuccess,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: articleApi.ARTICLES_FEED_KEY,
    queryFn: ({ pageParam }) => articleApi.articlesFeedQuery(pageParam),
    initialPageParam: { limit: query.limit, offset: query.offset },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < lastPageParam.limit || !lastPage.length) {
        return null;
      }

      return {
        limit: lastPageParam.limit,
        offset: allPages.length * lastPageParam.limit,
      };
    },
  });

  return (
    <>
      {isLoading && <ArticlePreview>Loading articles...</ArticlePreview>}

      {isError && (
        <ArticlePreview>
          <ErrorHandler error={error} />
        </ArticlePreview>
      )}

      {isSuccess &&
        !hasNextPage &&
        articles.pages.length === 1 &&
        articles.pages[0].length === 0 && (
          <ArticlePreview>No articles are here... yet.</ArticlePreview>
        )}

      {isSuccess &&
        articles.pages.map((group) =>
          group.map((article) => (
            <ArticlePreviewCard
              key={article.slug}
              article={article}
              meta={
                <ArticleMeta
                  article={article}
                  actionSlot={
                    article.favorited ? (
                      <UnfavoriteArticleButton
                        className="pull-xs-right"
                        article={article}
                      >
                        {article.favoritesCount}
                      </UnfavoriteArticleButton>
                    ) : (
                      <FavoriteArticleButton
                        className="pull-xs-right"
                        article={article}
                      >
                        {article.favoritesCount}
                      </FavoriteArticleButton>
                    )
                  }
                />
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
            disabled={!hasNextPage || isFetchingNextPage}
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

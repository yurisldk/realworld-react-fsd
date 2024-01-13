import { ReactNode } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { IoHeart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import {
  articleApi,
  ArticleMeta,
  ArticlePreviewCard,
  articleTypes,
} from '~entities/article';
import { sessionApi } from '~entities/session';
import {
  FavoriteArticleButton,
  UnfavoriteArticleButton,
} from '~features/article';
import { PATH_PAGE } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error';

type GlobalArticlesListProps = { query: articleTypes.ArticlesQueryDto };

export function GlobalArticlesList(props: GlobalArticlesListProps) {
  const { query } = props;

  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: sessionApi.CURRENT_USER_KEY,
    queryFn: sessionApi.currentUserQuery,
  });

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
    queryKey: articleApi.ARTICLES_KEY,
    queryFn: ({ pageParam }) =>
      articleApi.articlesQuery({ ...query, ...pageParam }),
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
                    user ? (
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
                    ) : (
                      <Button
                        color="primary"
                        variant="outline"
                        className="pull-xs-right"
                        onClick={() => navigate(PATH_PAGE.login)}
                      >
                        <IoHeart size={16} />
                        {article.favoritesCount}
                      </Button>
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

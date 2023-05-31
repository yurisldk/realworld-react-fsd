import { ReactNode } from 'react';
import { InfiniteData } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';

type ArticlesListProps = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  hasNextPage?: boolean;
  infinityArticles?: InfiniteData<conduitApi.ArticlesDto>;
  renderArticles: (article: conduitApi.ArticleDto) => ReactNode;
  nextPageAction: ReactNode;
};

export function ArticlesList(props: ArticlesListProps) {
  const {
    isLoading,
    isError,
    isSuccess,
    hasNextPage,
    infinityArticles,
    renderArticles,
    nextPageAction,
  } = props;

  return (
    <>
      {isLoading && <div className="article-preview">Loading articles...</div>}

      {/* TODO: add error handler */}
      {isError && <div className="article-preview">Error: </div>}

      {isSuccess && !hasNextPage && infinityArticles!.pages.length === 1 && (
        <div className="article-preview">No articles are here... yet.</div>
      )}

      {isSuccess &&
        infinityArticles!.pages.map((group) =>
          group.articles.map(renderArticles),
        )}

      {hasNextPage && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {nextPageAction}
        </div>
      )}
    </>
  );
}

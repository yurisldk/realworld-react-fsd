import { ReactNode } from 'react';
import { InfiniteData } from '@tanstack/react-query';
import { ArticleDto } from '~shared/api/realworld';

type ArticlesListProps = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  hasNextPage?: boolean;
  infinityArticles?: InfiniteData<ArticleDto[]>;
  renderArticles: (article: ArticleDto) => ReactNode;
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

      {isSuccess &&
        !hasNextPage &&
        infinityArticles!.pages.length === 1 &&
        infinityArticles!.pages[0].length === 0 && (
          <div className="article-preview">No articles are here... yet.</div>
        )}

      {isSuccess &&
        infinityArticles!.pages.map((group) => group.map(renderArticles))}

      {hasNextPage && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {nextPageAction}
        </div>
      )}
    </>
  );
}

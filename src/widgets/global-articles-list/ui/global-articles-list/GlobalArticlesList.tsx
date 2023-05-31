import { articleApi, ArticlePreviewCard } from '~entities/article';
import {
  UnfavoriteArticleButton,
  FavoriteArticleButton,
} from '~features/article';

export function GlobalArticlesList() {
  const {
    data: articlesData,
    status: articlesStatus,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = articleApi.useGlobalArticles();

  return (
    <>
      {articlesStatus === 'loading' && (
        <div className="article-preview">Loading articles...</div>
      )}

      {/* TODO: add error handler */}
      {articlesStatus === 'error' && (
        <div className="article-preview">Error: </div>
      )}

      {articlesStatus === 'success' &&
        !hasNextPage &&
        articlesData.pages.length === 1 && (
          <div className="article-preview">No articles are here... yet.</div>
        )}

      {articlesStatus === 'success' &&
        articlesData.pages.map((group) =>
          group.articles.map((article) => (
            <ArticlePreviewCard
              key={article.slug}
              article={article}
              actionSlot={
                article.favorited ? (
                  <UnfavoriteArticleButton article={article} />
                ) : (
                  <FavoriteArticleButton article={article} />
                )
              }
            />
          )),
        )}
      {hasNextPage && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            type="button"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}

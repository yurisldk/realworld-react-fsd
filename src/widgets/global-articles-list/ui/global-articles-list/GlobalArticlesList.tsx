import {
  articleApi,
  ArticlePreviewCard,
  ArticlesList,
  LoadMoreButton,
} from '~entities/article';
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
    // TODO: pass error and handle it
    <ArticlesList
      isLoading={articlesStatus === 'loading'}
      isError={articlesStatus === 'error'}
      isSuccess={articlesStatus === 'success'}
      hasNextPage={hasNextPage}
      infinityArticles={articlesData}
      renderArticles={(article) => (
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
      )}
      nextPageAction={
        <LoadMoreButton
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        />
      }
    />
  );
}

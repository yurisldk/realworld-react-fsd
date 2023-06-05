import {
  articleApi,
  ArticleMeta,
  ArticlePreviewCard,
  ArticlesList,
  LoadMoreButton,
} from '~entities/article';
import { ToggleFavoriteArticleButton } from '~features/article';

const queryKey = ['userfeed'];

export function UserFeedArticlesList() {
  const {
    data: articlesData,
    status: articlesStatus,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = articleApi.useUserFeedArticles(queryKey);

  if (isError) {
    console.log(error);
  }

  return (
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
          meta={
            <ArticleMeta
              article={article}
              actionSlot={
                <ToggleFavoriteArticleButton
                  queryKey={queryKey}
                  article={article}
                />
              }
            />
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

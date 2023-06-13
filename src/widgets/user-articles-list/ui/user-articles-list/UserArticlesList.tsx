import {
  articleApi,
  ArticleMeta,
  ArticlePreviewCard,
  ArticlesList,
  LoadMoreButton,
} from '~entities/article';
import { ToggleFavoriteArticleButton } from '~features/article';

type UserArticlesListProps = {
  query: articleApi.UserfeedQuery;
};

export function UserArticlesList(props: UserArticlesListProps) {
  const { query } = props;

  const queryKey = articleApi.articleKeys.articles.userfeed.query(query);

  const {
    data: articlesData,
    status: articlesStatus,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = articleApi.useUserInfinityArticles(query);

  return (
    <ArticlesList
      isLoading={articlesStatus === 'loading'}
      isError={articlesStatus === 'error'}
      isSuccess={articlesStatus === 'success'}
      error={error}
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
                  followTitle={article.favoritesCount.toString()}
                  unfollowTitle={article.favoritesCount.toString()}
                  float="right"
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

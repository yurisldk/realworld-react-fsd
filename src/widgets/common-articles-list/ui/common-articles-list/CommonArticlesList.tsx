import { StoreApi } from 'zustand';
import {
  articleApi,
  articleFilterModel,
  ArticleMeta,
  ArticlePreviewCard,
  ArticlesList,
  LoadMoreButton,
} from '~entities/article';
import { sessionModel } from '~entities/session';
import { ToggleFavoriteArticleButton } from '~features/article';
import { NavigateToLoginFavoriteButton } from '~features/session';

type CommonArticlesListProps = {
  model: StoreApi<articleFilterModel.ArticleFilterState>;
};

export function CommonArticlesList(props: CommonArticlesListProps) {
  const { model } = props;

  const isAuth = sessionModel.useAuth();

  const filter = articleFilterModel.selectFilter(model);

  const queryKey = articleApi.articleKeys.articles.query(filter);

  const {
    data: articlesData,
    status: articlesStatus,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = articleApi.useCommonInfinityArticles(filter, { secure: isAuth });

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
                isAuth ? (
                  <ToggleFavoriteArticleButton
                    queryKey={queryKey}
                    article={article}
                    followTitle={article.favoritesCount.toString()}
                    unfollowTitle={article.favoritesCount.toString()}
                    float="right"
                  />
                ) : (
                  <NavigateToLoginFavoriteButton
                    favoritesCount={article.favoritesCount}
                  />
                )
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

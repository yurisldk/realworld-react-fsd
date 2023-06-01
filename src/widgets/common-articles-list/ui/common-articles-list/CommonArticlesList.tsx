import { StoreApi } from 'zustand';
import {
  articleApi,
  articleFilterModel,
  ArticlePreviewCard,
  ArticlesList,
  LoadMoreButton,
} from '~entities/article';
import { sessionModel } from '~entities/session';
import { ToggleFavoriteArticleButton } from '~features/article';
import { NavigateToLoginFavoriteButton } from '~features/session';

type CommonArticlesListProps = {
  model: StoreApi<articleFilterModel.ArticleFilterState>;
  queryKey: string[];
};

export function CommonArticlesList(props: CommonArticlesListProps) {
  const { model, queryKey } = props;

  const filter = articleFilterModel.selectFilter(model);

  const {
    data: articlesData,
    status: articlesStatus,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = articleApi.useCommonInfinityArticles(queryKey, filter);

  const isAuth = sessionModel.useAuth();

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
            isAuth ? (
              <ToggleFavoriteArticleButton
                queryKey={queryKey}
                article={article}
              />
            ) : (
              <NavigateToLoginFavoriteButton
                favoritesCount={article.favoritesCount}
              />
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

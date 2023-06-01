import {
  articleApi,
  ArticlePreviewCard,
  ArticlesList,
  LoadMoreButton,
} from '~entities/article';
import { sessionModel } from '~entities/session';
import { ToggleFavoriteArticleButton } from '~features/article';
import { NavigateToLoginFavoriteButton } from '~features/session';

type TagArticlesListProps = {
  tag: string;
};

export function TagArticlesList(props: TagArticlesListProps) {
  const { tag } = props;

  const queryKey = ['tag', tag];

  const {
    data: articlesData,
    status: articlesStatus,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = articleApi.useInfinityArticles(queryKey, { tag });

  const isAuth = sessionModel.useAuth();

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

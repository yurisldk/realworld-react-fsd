import {
  articleApi,
  ArticlePreviewCard,
  ArticlesList,
  LoadMoreButton,
} from '~entities/article';
import { sessionModel } from '~entities/session';
import { ToggleFavoriteArticleButton } from '~features/article';
import { NavigateToLoginFavoriteButton } from '~features/session';

type FavoritedArticlesListProps = {
  username: string;
};

export function FavoritedArticlesList(props: FavoritedArticlesListProps) {
  const { username } = props;

  const queryKey = ['username', username, 'favorited'];

  const {
    data: articlesData,
    status: articlesStatus,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = articleApi.useInfinityArticles(queryKey, { favorited: username });

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

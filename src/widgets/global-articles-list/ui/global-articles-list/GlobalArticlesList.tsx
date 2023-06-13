import { useNavigate } from 'react-router-dom';
import {
  articleApi,
  ArticleMeta,
  ArticlePreviewCard,
  ArticlesList,
  FavoriteButton,
  LoadMoreButton,
} from '~entities/article';
import { sessionModel } from '~entities/session';
import { ToggleFavoriteArticleButton } from '~features/article';
import { PATH_PAGE } from '~shared/lib/react-router';

type GlobalArticlesListProps = {
  query: articleApi.GlobalfeedQuery;
};

export function GlobalArticlesList(props: GlobalArticlesListProps) {
  const { query } = props;

  const isAuth = sessionModel.useAuth();

  const navigate = useNavigate();

  const queryKey = articleApi.articleKeys.articles.globalfeed.query(query);

  const {
    data: articlesData,
    status: articlesStatus,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = articleApi.useGlobalInfinityArticles(query, { secure: isAuth });

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
                  <FavoriteButton
                    title={article.favoritesCount}
                    float="right"
                    onClick={() => navigate(PATH_PAGE.login)}
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

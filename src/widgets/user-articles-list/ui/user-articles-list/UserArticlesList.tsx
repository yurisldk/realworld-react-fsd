import {
  articleApi,
  ArticleMeta,
  ArticlePreviewCard,
  ArticlesList,
} from '~entities/article';
import {
  UnfavoriteArticleButton,
  FavoriteArticleButton,
} from '~features/article';
import { Button } from '~shared/ui/button';

type UserArticlesListProps = {
  query: articleApi.UserfeedQuery;
};

export function UserArticlesList(props: UserArticlesListProps) {
  const { query } = props;

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
                article.favorited ? (
                  <UnfavoriteArticleButton
                    className="pull-xs-right"
                    article={article}
                  >
                    {article.favoritesCount}
                  </UnfavoriteArticleButton>
                ) : (
                  <FavoriteArticleButton
                    className="pull-xs-right"
                    article={article}
                  >
                    {article.favoritesCount}
                  </FavoriteArticleButton>
                )
              }
            />
          }
        />
      )}
      nextPageAction={
        <Button
          color="primary"
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </Button>
      }
    />
  );
}

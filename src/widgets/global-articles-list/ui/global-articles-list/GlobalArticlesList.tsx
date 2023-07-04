/* eslint-disable no-nested-ternary */
import { IoHeart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import {
  articleApi,
  ArticleMeta,
  ArticlePreviewCard,
  ArticlesList,
} from '~entities/article';
import { sessionModel } from '~entities/session';
import {
  FavoriteArticleButton,
  UnfavoriteArticleButton,
} from '~features/article';
import { PATH_PAGE } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';

type GlobalArticlesListProps = {
  query: articleApi.GlobalfeedQuery;
};

export function GlobalArticlesList(props: GlobalArticlesListProps) {
  const { query } = props;

  const isAuth = sessionModel.useAuth();

  const navigate = useNavigate();

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
                ) : (
                  <Button
                    color="primary"
                    variant="outline"
                    className="pull-xs-right"
                    onClick={() => navigate(PATH_PAGE.login)}
                  >
                    <IoHeart size={16} />
                    {article.favoritesCount}
                  </Button>
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

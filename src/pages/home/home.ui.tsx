import { Suspense } from 'react';
import { IoHeart } from 'react-icons/io5';
import { Await, Link, useFetcher, useLoaderData, useLocation } from 'react-router';
import type { ArticlePreview } from '~shared/api/generated/schemas/articlePreview.zod';
import type { GetArticlesParams } from '~shared/api/generated/schemas/getArticlesParams.zod';
import type { MultipleArticlesResponse } from '~shared/api/generated/schemas/multipleArticlesResponse.zod';
import { formatDate } from '~shared/lib/date';
import { AsyncErrorCard } from '~shared/ui/async-error-card/async-error-card.ui';
import { Spinner } from '~shared/ui/spinner/spinner.ui';
import type { HomePageLoaderData } from './home.loader';
import { homePaths } from './home.paths';
import type { HomeSearchParams } from './home.state';
import { getGlobalFeedLink, getPersonalFeedLink, getTagFeedLink } from './home.state';

export function HomePage() {
  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <HomeFeed />
          </div>

          <div className="col-md-3">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeFeed() {
  const { articlesPromise, userData, searchParams, navigation } = useLoaderData<HomePageLoaderData>();
  const isAuthenticated = Boolean(userData?.user?.username);

  return (
    <>
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">
          {isAuthenticated && (
            <li className="nav-item">
              <Link
                className={navigation.isPersonalActive ? 'nav-link active' : 'nav-link'}
                to={{ search: getPersonalFeedLink(searchParams) }}
                replace
                aria-current={navigation.isPersonalActive ? 'page' : undefined}
              >
                Your Feed
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link
              className={navigation.isGlobalActive ? 'nav-link active' : 'nav-link'}
              to={{ search: getGlobalFeedLink(searchParams) }}
              replace
              aria-current={navigation.isGlobalActive ? 'page' : undefined}
            >
              Global Feed
            </Link>
          </li>

          {navigation.tag && (
            <li className="nav-item">
              <span className="nav-link active">#{navigation.tag}</span>
            </li>
          )}
        </ul>
      </div>

      <Suspense fallback={<Spinner />}>
        <Await resolve={articlesPromise} errorElement={<HomeFeedError />}>
          {(articlesData) => (
            <HomeArticlesList
              articles={articlesData.articles}
              articlesCount={articlesData.articlesCount}
              searchParams={searchParams}
            />
          )}
        </Await>
      </Suspense>
    </>
  );
}

type HomeArticlesListProps = {
  articles: MultipleArticlesResponse['articles'];
  articlesCount: MultipleArticlesResponse['articlesCount'];
  searchParams: GetArticlesParams;
};

function HomeArticlesList({ articles, articlesCount, searchParams }: HomeArticlesListProps) {
  if (articlesCount === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <HomeArticlePreviewCard key={article.slug} article={article} />
      ))}

      <HomeArticleListPagination searchParams={searchParams} articlesCount={articlesCount} />
    </>
  );
}

type HomeArticlePreviewCardProps = {
  article: ArticlePreview;
};

function HomeArticlePreviewCard({ article }: HomeArticlePreviewCardProps) {
  const { author, updatedAt, slug, title, description, tagList } = article;
  const { username, image } = author;

  return (
    <div className="article-preview" data-test="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${username}`}>
          <img src={image} alt={username} />
        </Link>

        <div className="info">
          <Link className="author" to={`/profile/${username}`}>
            {username}
          </Link>

          <span className="date">{formatDate(updatedAt)}</span>
        </div>

        <HomeFavoriteButton article={article} />
      </div>

      <Link className="preview-link" to={`/article/${slug}`}>
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}

type HomeFavoriteButtonProps = {
  article: ArticlePreview;
};

function HomeFavoriteButton({ article }: HomeFavoriteButtonProps) {
  const { slug, favorited, favoritesCount } = article;
  const favoriteToggleFetcher = useFetcher({ key: `article-favorite-toggle-${slug}` });
  const optimisticOperation = favoriteToggleFetcher.formData?.get('operation');

  let isFavorited = favorited;

  if (optimisticOperation === 'favorite') {
    isFavorited = true;
  }

  if (optimisticOperation === 'unfavorite') {
    isFavorited = false;
  }

  const optimisticFavoritesCount = favoritesCount + Number(isFavorited) - Number(favorited);

  const handleFavoriteToggle = () => {
    const operation = isFavorited ? 'unfavorite' : 'favorite';
    const formData = new FormData();
    formData.set('operation', operation);
    favoriteToggleFetcher.submit(formData, { method: 'post', action: homePaths.getFavoriteTogglePath(slug) });
  };

  return (
    <button
      type="button"
      onClick={handleFavoriteToggle}
      aria-label={isFavorited ? 'Unfavorite article' : 'Favorite article'}
      className={isFavorited ? 'btn btn-sm pull-xs-right btn-primary' : 'btn btn-sm pull-xs-right btn-outline-primary'}
    >
      <IoHeart size={14} />
      &nbsp;{Math.max(0, optimisticFavoritesCount)}
    </button>
  );
}

type HomeArticleListPaginationProps = {
  searchParams: GetArticlesParams;
  articlesCount: number;
};

function HomeArticleListPagination({ searchParams, articlesCount }: HomeArticleListPaginationProps) {
  const limit = Math.max(searchParams.limit, 1);
  const pageOffsets = Array.from({ length: Math.ceil(articlesCount / limit) }, (_, index) => index * limit);
  const location = useLocation();

  function buildPaginationSearchParams(offset: number) {
    const nextSearchParams = new URLSearchParams(location.search);
    nextSearchParams.set('offset', String(offset));
    return `?${nextSearchParams.toString()}`;
  }

  if (pageOffsets.length <= 1) {
    return null;
  }

  return (
    <ul className="pagination">
      {pageOffsets.map((offset, pageIndex) => {
        const isActive = offset === searchParams.offset;

        return (
          <li key={`page-${offset}`} className={isActive ? 'page-item active' : 'page-item'}>
            <Link
              className="page-link"
              to={{ search: buildPaginationSearchParams(offset) }}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageIndex + 1}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Sidebar() {
  const { tagsPromise, searchParams } = useLoaderData<HomePageLoaderData>();

  return (
    <Suspense fallback={<Spinner />}>
      <div className="sidebar">
        <p>Popular Tags</p>

        <Await resolve={tagsPromise} errorElement={<SidebarError />}>
          {(tagsData) => <TagList tags={tagsData.tags} searchParams={searchParams} />}
        </Await>
      </div>
    </Suspense>
  );
}

type TagListProps = {
  tags: string[];
  searchParams: HomeSearchParams;
};

function TagList({ tags, searchParams }: TagListProps) {
  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <Link key={tag} className="tag-pill tag-default" to={{ search: getTagFeedLink(searchParams, tag) }} replace>
          {tag}
        </Link>
      ))}
    </div>
  );
}

function HomeFeedError() {
  return <AsyncErrorCard title="Could not load articles" fallbackMessage="Try again later." />;
}

function SidebarError() {
  return <AsyncErrorCard title="Could not load tags" fallbackMessage="Try again later." />;
}

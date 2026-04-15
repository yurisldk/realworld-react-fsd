import { Suspense } from 'react';
import { IoAdd, IoHeart, IoRemove, IoSettingsSharp } from 'react-icons/io5';
import { Await, Link, useFetcher, useLoaderData, useLocation, useParams } from 'react-router';
import type { ArticlePreview } from '~shared/api/generated/schemas/articlePreview.zod';
import type { GetArticlesParams } from '~shared/api/generated/schemas/getArticlesParams.zod';
import type { MultipleArticlesResponse } from '~shared/api/generated/schemas/multipleArticlesResponse.zod';
import type { ProfileResponse } from '~shared/api/generated/schemas/profileResponse.zod';
import { formatDate } from '~shared/lib/date';
import { AsyncErrorCard } from '~shared/ui/async-error-card/async-error-card.ui';
import { Spinner } from '~shared/ui/spinner/spinner.ui';
import type { ProfilePageLoaderData } from './profile.loader';
import { profilePaths } from './profile.paths';
import { getProfileArticlesLink, getProfileFavoritedLink } from './profile.state';

export function ProfilePage() {
  const { profilePromise } = useLoaderData<ProfilePageLoaderData>();

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <Suspense fallback={<Spinner />}>
                <Await resolve={profilePromise} errorElement={<ProfileInfoError />}>
                  {(profileData) => <ProfileInfo profile={profileData.profile} />}
                </Await>
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <ProfileFeed />
          </div>
        </div>
      </div>
    </div>
  );
}

type ProfileInfoProps = {
  profile: ProfileResponse['profile'];
};

function ProfileInfo({ profile }: ProfileInfoProps) {
  const { userData } = useLoaderData<ProfilePageLoaderData>();

  const isOwnProfile = userData?.user?.username === profile.username;

  return (
    <>
      <img src={profile.image} className="user-img" alt={profile.username} />
      <h4 data-test="app-header-username">{profile.username}</h4>
      <p data-test="app-header-bio">{profile.bio}</p>

      {!isOwnProfile && <ProfileFollowButton profile={profile} />}

      {isOwnProfile && (
        <Link to="/settings" className="btn btn-sm btn-outline-secondary action-btn">
          <IoSettingsSharp size={14} />
          &nbsp; Edit Profile Settings
        </Link>
      )}
    </>
  );
}

type ProfileFollowButtonProps = {
  profile: ProfileResponse['profile'];
};

function ProfileFollowButton({ profile }: ProfileFollowButtonProps) {
  const followToggleFetcher = useFetcher({ key: `profile-follow-toggle-${profile.username}` });
  const optimisticOperation = followToggleFetcher.formData?.get('operation');

  let isFollowing = profile.following;

  if (optimisticOperation === 'follow') {
    isFollowing = true;
  }

  if (optimisticOperation === 'unfollow') {
    isFollowing = false;
  }

  const onToggleFollow = () => {
    const operation = isFollowing ? 'unfollow' : 'follow';
    const formData = new FormData();
    formData.set('operation', operation);
    formData.set('username', profile.username);
    followToggleFetcher.submit(formData, {
      method: 'post',
      action: profilePaths.getFollowTogglePath(profile.username),
    });
  };

  return (
    <button
      type="button"
      onClick={onToggleFollow}
      aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
      className={
        isFollowing ? 'btn btn-sm btn-outline-secondary action-btn' : 'btn btn-sm btn-outline-primary action-btn'
      }
    >
      {isFollowing ? <IoRemove size={14} /> : <IoAdd size={14} />}
      &nbsp; {isFollowing ? 'Unfollow' : 'Follow'} {profile.username}
    </button>
  );
}

function ProfileFeed() {
  const { username = '' } = useParams();
  const { articlesPromise, searchParams, navigation } = useLoaderData<ProfilePageLoaderData>();

  return (
    <>
      <div className="articles-toggle">
        <ul className="nav nav-pills outline-active">
          <li className="nav-item">
            <Link
              className={navigation.isAuthorFeedActive ? 'nav-link active' : 'nav-link'}
              to={{ search: getProfileArticlesLink(searchParams, username) }}
              replace
              aria-current={navigation.isAuthorFeedActive ? 'page' : undefined}
            >
              My Articles
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={navigation.isFavoritedFeedActive ? 'nav-link active' : 'nav-link'}
              to={{ search: getProfileFavoritedLink(searchParams, username) }}
              replace
              aria-current={navigation.isFavoritedFeedActive ? 'page' : undefined}
            >
              Favorited Articles
            </Link>
          </li>
        </ul>
      </div>

      <Suspense fallback={<Spinner />}>
        <Await resolve={articlesPromise} errorElement={<ProfileFeedError />}>
          {(articlesData) => (
            <ProfileArticlesList
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

type ProfileArticlesListProps = {
  articles: MultipleArticlesResponse['articles'];
  articlesCount: MultipleArticlesResponse['articlesCount'];
  searchParams: GetArticlesParams;
};

function ProfileArticlesList({ articles, articlesCount, searchParams }: ProfileArticlesListProps) {
  if (articlesCount === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <ProfileArticlePreviewCard key={article.slug} article={article} />
      ))}

      <ProfileArticleListPagination searchParams={searchParams} articlesCount={articlesCount} />
    </>
  );
}

type ProfileArticlePreviewCardProps = {
  article: ArticlePreview;
};

function ProfileArticlePreviewCard({ article }: ProfileArticlePreviewCardProps) {
  const { author, updatedAt, slug, title, description, tagList } = article;
  const { username: authorUsername, image } = author;

  return (
    <div className="article-preview" data-test="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${authorUsername}`}>
          <img src={image} alt={authorUsername} />
        </Link>

        <div className="info">
          <Link className="author" to={`/profile/${authorUsername}`}>
            {authorUsername}
          </Link>

          <span className="date">{formatDate(updatedAt)}</span>
        </div>

        <ProfileFavoriteButton article={article} />
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

type ProfileFavoriteButtonProps = {
  article: ArticlePreview;
};

function ProfileFavoriteButton({ article }: ProfileFavoriteButtonProps) {
  const { username = '' } = useParams();

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
    favoriteToggleFetcher.submit(formData, {
      method: 'post',
      action: profilePaths.getFavoriteTogglePath(username, slug),
    });
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

type ProfileArticleListPaginationProps = {
  searchParams: GetArticlesParams;
  articlesCount: number;
};

function ProfileArticleListPagination({ searchParams, articlesCount }: ProfileArticleListPaginationProps) {
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

function ProfileFeedError() {
  return <AsyncErrorCard title="Could not load profile feed" fallbackMessage="Try again later." />;
}

function ProfileInfoError() {
  return <AsyncErrorCard title="Could not load profile" fallbackMessage="Try again later." />;
}

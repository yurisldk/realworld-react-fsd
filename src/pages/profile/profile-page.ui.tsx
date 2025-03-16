import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { IoAdd, IoSettingsSharp } from 'react-icons/io5';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { Button } from '~shared/ui/button/button.ui';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { Profile } from '~entities/profile/profie.types';
import { profileQueryOptions } from '~entities/profile/profile.api';
import { SecondaryLoaderArgs } from '~features/article/filter-article/filter-article.types';
import { SecondaryFilter } from '~features/article/filter-article/filter-article.ui';
import { useCanPerformAction } from '~features/permission/permission.service';
import { FollowUserButton } from '~features/profile/follow-profile/follow-profile.ui';
import { UnfollowUserButton } from '~features/profile/unfollow-profile/unfollow-profile.ui';
import { ArticlesFeed } from '~widgets/articles-feed/articles-feed.ui';
import { ProfileInfoSkeleton } from './profile-page.skeleton';

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <ProfileInfo />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <SecondaryFilter />
            <ArticlesFeed />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileInfo() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<ProfileInfoSkeleton />}>
        <BaseProfileInfo />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseProfileInfo() {
  const { params } = useLoaderData() as SecondaryLoaderArgs;
  const { username } = params;

  const { data: profile } = useSuspenseQuery(profileQueryOptions(username));

  return (
    <>
      <img src={profile.image} className="user-img" alt={profile.username} />
      <h4>{profile.username}</h4>
      <p>{profile.bio}</p>

      <ToggleFollowProfile profile={profile} />
    </>
  );
}

function ToggleFollowProfile(props: { profile: Profile }) {
  const { profile } = props;
  const { username, following } = profile;

  const canUpdateProfile = useCanPerformAction('update', 'profile', {
    profileOwnerId: username,
  });
  const canFollow = useCanPerformAction('follow', 'profile');
  const canUnfollow = useCanPerformAction('unfollow', 'profile');
  const canFollowProfile = !canUpdateProfile && canFollow && !following;
  const canUnfollowProfile = !canUpdateProfile && canUnfollow && following;
  const cannotFollowAndUnfollowProfile = !canFollow && !canUnfollow;

  return (
    <>
      {canFollowProfile && <FollowUserButton username={username} />}
      {canUnfollowProfile && <UnfollowUserButton username={username} />}
      {canUpdateProfile && <NavigateToSettingsButton />}
      {cannotFollowAndUnfollowProfile && <NavigateToLoginButton username={profile.username} />}
    </>
  );
}

function NavigateToSettingsButton() {
  const navigate = useNavigate();

  return (
    <Button color="secondary" variant="outline" className="action-btn" onClick={() => navigate(pathKeys.settings)}>
      <IoSettingsSharp size={14} />
      &nbsp; Edit Profile Settings
    </Button>
  );
}

function NavigateToLoginButton(props: { username: string }) {
  const { username } = props;

  const navigate = useNavigate();

  const onClick = () => navigate(pathKeys.login);

  return (
    <Button color="secondary" variant="outline" className="action-btn " onClick={onClick}>
      <IoAdd size={16} />
      &nbsp; Follow {username}
    </Button>
  );
}

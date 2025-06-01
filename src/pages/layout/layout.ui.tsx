import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { IoCreateOutline, IoSettingsSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Outlet, NavLink } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { Skeleton } from '~shared/ui/skeleton/skeleton.ui';
import { Stack } from '~shared/ui/stack/stack.ui';
import { sessionQueryOptions } from '~entities/session/session.api';
import { selectSession } from '~entities/session/session.model';
import { useCanPerformAction } from '~features/permission/permission.service';

export default function Layout() {
  const session = useSelector(selectSession);
  return session?.token ? <UserLayout /> : <GuestLayout />;
}

function UserLayout() {
  return (
    <>
      <Navigation links={[UserNavigation]} />
      <Outlet />
      <Footer />
    </>
  );
}

function GuestLayout() {
  return (
    <>
      <Navigation links={[HomeLink, SignInLink, SignUpLink]} />
      <Outlet />
      <Footer />
    </>
  );
}

function Navigation({ links }: { links: Array<() => JSX.Element> }) {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <BrandLink />
        <ul className="nav navbar-nav pull-xs-right">
          {links.map((LinkComponent, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index} className="nav-item">
              <LinkComponent />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function UserNavigation() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<UserNavigationSkeleton />}>
        <BaseUserNavigation />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseUserNavigation() {
  const session = useSelector(selectSession);

  const canCreateArticle = useCanPerformAction('create', 'article');
  const canUpdateProfile = useCanPerformAction('update', 'profile', { profileOwnerId: session?.username || '' });

  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <HomeLink />
      </li>
      {canCreateArticle && (
        <li className="nav-item">
          <NewArticleLink />
        </li>
      )}
      {canUpdateProfile && (
        <li className="nav-item">
          <SettingsProfileLink />
        </li>
      )}
      {canUpdateProfile && (
        <li className="nav-item">
          <ProfileLink />
        </li>
      )}
    </ul>
  );
}

function BrandLink() {
  return (
    <NavLink className="navbar-brand" to={pathKeys.home}>
      conduit
    </NavLink>
  );
}

function HomeLink() {
  return (
    <NavLink className="nav-link" to={pathKeys.home}>
      Home
    </NavLink>
  );
}

function SignInLink() {
  return (
    <NavLink className="nav-link" to={pathKeys.login}>
      Sign in
    </NavLink>
  );
}

function SignUpLink() {
  return (
    <NavLink className="nav-link" to={pathKeys.register}>
      Sign up
    </NavLink>
  );
}

function NewArticleLink() {
  return (
    <NavLink className="nav-link" to={pathKeys.editor.root}>
      <IoCreateOutline size={16} /> &nbsp;New Article
    </NavLink>
  );
}

function SettingsProfileLink() {
  return (
    <NavLink className="nav-link" to={pathKeys.settings}>
      <IoSettingsSharp size={16} /> &nbsp;Settings
    </NavLink>
  );
}

function ProfileLink() {
  const { data: user } = useSuspenseQuery(sessionQueryOptions);
  return (
    <NavLink className="nav-link" to={pathKeys.profile.byUsername(user.username)}>
      <img className="user-pic" src={user.image} alt={user.username} /> {user.username}
    </NavLink>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <NavLink className="logo-font" to={pathKeys.home}>
          conduit
        </NavLink>
        <span className="attribution">
          An interactive learning project from{' '}
          <a href="https://thinkster.io" target="_blank" rel="noreferrer">
            Thinkster
          </a>
          . Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  );
}

function UserNavigationSkeleton() {
  return (
    <Stack spacing={16} alignItems="center" justifyContent="flex-end" style={{ height: '38px' }}>
      <Skeleton width={40} />
      <Skeleton width={90} />
      <Skeleton width={70} />
      <Stack alignItems="center" spacing={4}>
        <Skeleton variant="circular" width={26} height={26} />
        <Skeleton />
      </Stack>
    </Stack>
  );
}

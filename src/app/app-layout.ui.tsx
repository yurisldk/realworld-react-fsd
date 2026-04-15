import { IoCreateOutline, IoSettingsSharp } from 'react-icons/io5';
import { useLoaderData, Outlet, NavLink } from 'react-router';
import { UserResponse } from '~shared/api/generated/schemas/userResponse.zod';
import { GlobalProgressBar } from '~shared/ui/global-progress-bar/global-progress-bar.ui';
import { AppLoaderData } from './app.loader';

export function Layout() {
  const { userData } = useLoaderData<AppLoaderData>();
  const { user } = userData || {};

  return (
    <>
      <GlobalProgressBar />
      <nav className="navbar navbar-light">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            conduit
          </NavLink>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            {user ? <UserLinks user={user} /> : <GuestLinks />}
          </ul>
        </div>
      </nav>
      <Outlet />
      <footer>
        <div className="container">
          <NavLink className="logo-font" to="/">
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
    </>
  );
}

type UserLinksProps = {
  user: UserResponse['user'];
};

function UserLinks({ user }: UserLinksProps) {
  const { username, image } = user;

  return (
    <>
      <li className="nav-item">
        <NavLink className="nav-link" to="/editor">
          <IoCreateOutline size={16} /> New Article
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/settings">
          <IoSettingsSharp size={16} /> Settings
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/profile/${username}`}>
          <img className="user-pic" src={image} alt={username} /> {username}
        </NavLink>
      </li>
    </>
  );
}

function GuestLinks() {
  return (
    <>
      <li className="nav-item">
        <NavLink className="nav-link" to="/login">
          Sign in
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/register">
          Sign up
        </NavLink>
      </li>
    </>
  );
}

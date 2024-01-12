import { useQuery } from '@tanstack/react-query';
import { IoCreateOutline, IoSettingsSharp } from 'react-icons/io5';
import { NavLink, Outlet } from 'react-router-dom';
import { sessionApi, sessionModel } from '~entities/session';
import { PATH_PAGE } from '~shared/lib/react-router';

export function MainLayout() {
  const isAuth = sessionModel.useAuth();

  // TODO: add loading, error, etc... states
  const { data: user } = useQuery({
    queryKey: sessionApi.CURRENT_USER_KEY,
    queryFn: sessionApi.currentUserQuery,
    enabled: isAuth,
  });

  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container">
          <NavLink className="navbar-brand" to={PATH_PAGE.root}>
            conduit
          </NavLink>
          {!user && (
            <ul className="nav navbar-nav pull-xs-right">
              <li className="nav-item">
                <NavLink className="nav-link" to={PATH_PAGE.root}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={PATH_PAGE.login}>
                  Sign in
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={PATH_PAGE.register}>
                  Sign up
                </NavLink>
              </li>
            </ul>
          )}
          {user && (
            <ul className="nav navbar-nav pull-xs-right">
              <li className="nav-item">
                <NavLink className="nav-link" to={PATH_PAGE.root}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={PATH_PAGE.editor.root}>
                  <IoCreateOutline size={16} />
                  &nbsp;New Article
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={PATH_PAGE.settings}>
                  <IoSettingsSharp size={16} />
                  &nbsp;Settings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to={PATH_PAGE.profile.root(user.username)}
                >
                  <img
                    className="user-pic"
                    src={user.image || ''}
                    alt={user.username}
                  />
                  {user.username}
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </nav>
      <Outlet />
      <footer>
        <div className="container">
          <NavLink className="logo-font" to={PATH_PAGE.root}>
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

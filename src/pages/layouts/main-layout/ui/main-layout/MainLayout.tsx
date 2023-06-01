import { NavLink, Outlet } from 'react-router-dom';
import { sessionApi, sessionModel } from '~entities/session';
import { PATH_PAGE } from '~shared/lib/react-router';

export function MainLayout() {
  const user = sessionModel.useCurrentUser();

  sessionApi.useCurrentUser({ enabled: !!user });

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
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                  to={PATH_PAGE.root}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/qwerty">
                  <i className="ion-compose" />
                  &nbsp;New Article
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={PATH_PAGE.settings}>
                  <i className="ion-gear-a" />
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

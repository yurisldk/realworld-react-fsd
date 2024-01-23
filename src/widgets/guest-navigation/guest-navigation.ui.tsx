import { NavLink } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';

export function GuestNavigation() {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <NavLink className="navbar-brand" to={pathKeys.home()}>
          conduit
        </NavLink>

        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink className="nav-link" to={pathKeys.home()}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={pathKeys.login()}>
              Sign in
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={pathKeys.register()}>
              Sign up
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

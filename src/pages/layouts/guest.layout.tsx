import { Outlet } from 'react-router-dom'
import {
  Footer,
  BrandLink,
  HomeLink,
  SignInLink,
  SignUpLink,
} from './layout.ui'

export function GuestLayout() {
  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container">
          <BrandLink />

          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <HomeLink />
            </li>
            <li className="nav-item">
              <SignInLink />
            </li>
            <li className="nav-item">
              <SignUpLink />
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
      <Footer />
    </>
  )
}

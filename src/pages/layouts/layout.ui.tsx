import { useSuspenseQuery } from '@tanstack/react-query'
import { IoCreateOutline, IoSettingsSharp } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import { pathKeys } from '~shared/lib/react-router'
import { SessionQueries } from '~shared/session'

export function Footer() {
  return (
    <footer>
      <div className="container">
        <NavLink
          className="logo-font"
          to={pathKeys.home()}
        >
          conduit
        </NavLink>
        <span className="attribution">
          An interactive learning project from{' '}
          <a
            href="https://thinkster.io"
            target="_blank"
            rel="noreferrer"
          >
            Thinkster
          </a>
          . Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  )
}

export function BrandLink() {
  return (
    <NavLink
      className="navbar-brand"
      to={pathKeys.home()}
    >
      conduit
    </NavLink>
  )
}

export function HomeLink() {
  return (
    <NavLink
      className="nav-link"
      to={pathKeys.home()}
    >
      Home
    </NavLink>
  )
}

export function SignInLink() {
  return (
    <NavLink
      className="nav-link"
      to={pathKeys.login()}
    >
      Sign in
    </NavLink>
  )
}

export function SignUpLink() {
  return (
    <NavLink
      className="nav-link"
      to={pathKeys.register()}
    >
      Sign up
    </NavLink>
  )
}

export function NewArticleLink() {
  return (
    <NavLink
      className="nav-link"
      to={pathKeys.editor.root()}
    >
      <IoCreateOutline size={16} />
      &nbsp;New Article
    </NavLink>
  )
}

export function SettingsProfileLink() {
  return (
    <NavLink
      className="nav-link"
      to={pathKeys.settings()}
    >
      <IoSettingsSharp size={16} />
      &nbsp;Settings
    </NavLink>
  )
}

export function ProfileLink() {
  const { data: user } = useSuspenseQuery(SessionQueries.currentSessionQuery())

  return (
    <NavLink
      className="nav-link"
      to={pathKeys.profile.byUsername({ username: user.username })}
    >
      <img
        className="user-pic"
        src={user.image}
        alt={user.username}
      />
      {user.username}
    </NavLink>
  )
}

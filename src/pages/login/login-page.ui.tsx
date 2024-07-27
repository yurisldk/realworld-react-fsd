import { Link } from 'react-router-dom'
import { pathKeys } from '~shared/lib/react-router'
import { LoginForm } from '~features/session'

export function LoginPage() {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>

            <p className="text-xs-center">
              <Link to={pathKeys.register()}>Need an account?</Link>
            </p>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { pathKeys } from '~shared/lib/react-router'
import { RegisterForm } from '~features/session'

export function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>

            <p className="text-xs-center">
              <Link to={pathKeys.login()}>Have an account?</Link>
            </p>

            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}

import { Link, Form, useActionData, useNavigation } from 'react-router';
import { ErrorMessages } from '~shared/ui/error-messages/error-messages.ui';
import type { UserRegisterActionData } from './actions/user-register.action';

export function RegisterPage() {
  const actionData = useActionData<UserRegisterActionData>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>

            {actionData && !actionData.ok && <ErrorMessages errors={actionData.errors} />}

            <Form method="POST">
              <fieldset disabled={isSubmitting}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="username"
                    placeholder="Username"
                    autoComplete="username"
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    required
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={isSubmitting}>
                  Sign up
                </button>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

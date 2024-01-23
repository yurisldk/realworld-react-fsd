import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { withErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import {
  sessionContracts,
  sessionQueries,
  sessionTypes,
} from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';

function Page() {
  const {
    mutate: createUser,
    isPending,
    isError,
    error,
  } = sessionQueries.useCreateUserMutation();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to={pathKeys.login()}>Have an account?</Link>
            </p>

            {isError && <ErrorHandler error={error} />}

            <Formik
              initialValues={initialUser}
              validate={formikContract(sessionContracts.CreateUserDtoSchema)}
              onSubmit={(user) => createUser({ user })}
            >
              <Form>
                <fieldset disabled={isPending}>
                  <fieldset className="form-group">
                    <Field
                      name="username"
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Name"
                    />
                    <ErrorMessage name="username" />
                  </fieldset>
                  <fieldset className="form-group">
                    <Field
                      name="email"
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                    />
                    <ErrorMessage name="email" />
                  </fieldset>
                  <fieldset className="form-group">
                    <Field
                      name="password"
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                    />
                    <ErrorMessage name="password" />
                  </fieldset>
                  <SubmitButton />
                </fieldset>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

const initialUser: sessionTypes.CreateUserDto = {
  email: '',
  username: '',
  password: '',
};

function SubmitButton() {
  const { isValidating, isValid } = useFormikContext();

  return (
    <button
      className="btn btn-lg btn-primary pull-xs-right"
      type="submit"
      disabled={!isValid || isValidating}
    >
      Sign up
    </button>
  );
}

export const RegisterPage = withErrorBoundary(Page, {
  fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});

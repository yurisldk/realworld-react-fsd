import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import { sessionApi, sessionModel } from '~entities/session';
import { PATH_PAGE } from '~shared/lib/react-router';

export function LoginPage() {
  const { mutate, isError, error } = useMutation({
    mutationKey: sessionApi.LOGIN_USER_KEY,
    mutationFn: sessionApi.loginUserMutation,
  });

  const updateToken = sessionModel.useUpdateToken();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to={PATH_PAGE.register}>Need an account?</Link>
            </p>

            {isError && <div>{error.message}</div>}

            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={object().shape({
                email: string().email().required(),
                password: string().min(5).required(),
              })}
              onSubmit={(values, { setSubmitting }) => {
                mutate(values, {
                  onSuccess: (user) => {
                    updateToken(user.token);
                  },
                  onSettled: () => {
                    setSubmitting(false);
                  },
                });
              }}
            >
              {({ isSubmitting }) => (
                <Form>
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
                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Sign in
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

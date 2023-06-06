import { ErrorMessage, Field, Form, Formik } from 'formik';
import { object, string } from 'yup';
import { sessionApi, sessionModel } from '~entities/session';
import { ErrorsList } from '~shared/ui/errors-list';

export function LoginPage() {
  const { mutate, isError, error } = sessionApi.useLoginUser();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="/#">Need an account?</a>
            </p>

            {isError && <ErrorsList errors={error!.error.errors} />}

            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              // TODO: add correct validation
              validationSchema={object().shape({
                email: string().required('requared'),
                password: string().required('requared'),
              })}
              onSubmit={(values, { setSubmitting }) => {
                mutate(values, {
                  onSuccess: (response) => {
                    sessionModel.addUser(response.data.user);
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

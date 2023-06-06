import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { sessionModel } from '~entities/session';
import { useCreateUser } from '~features/session';
import { ErrorsList } from '~shared/ui/errors-list';

export function RegisterPage() {
  const { mutate, isError, error } = useCreateUser();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="/#">Have an account?</a>
            </p>

            {isError && <ErrorsList errors={error!.error.errors} />}

            <Formik
              initialValues={{
                username: '',
                email: '',
                password: '',
              }}
              // TODO: add correct validation
              validationSchema={object().shape({
                username: string().required('requared'),
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
                  <fieldset disabled={isSubmitting}>
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
                    <button
                      className="btn btn-lg btn-primary pull-xs-right"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Sign up
                    </button>
                  </fieldset>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

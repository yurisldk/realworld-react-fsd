import { useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import { sessionApi, sessionModel } from '~entities/session';
import { LogoutButton, useUpdateCurrentUser } from '~features/session';
import { PATH_PAGE } from '~shared/lib/react-router';
import { ErrorsList } from '~shared/ui/errors-list';

export function SettingsPage() {
  const user = sessionModel.useCurrentUser();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const queryKey = sessionApi.sessionKeys.session.currentUser();

  const { mutate, isError, error } = useUpdateCurrentUser(
    queryKey,
    queryClient,
  );

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            {isError && <ErrorsList errors={error!.error.errors} />}

            <Formik
              initialValues={{
                ...user!,
                password: undefined,
                ...(!user!.bio && { bio: undefined }),
              }}
              // TODO: add correct validation
              validationSchema={object().shape({
                email: string().required('required'),
                token: string().required('required'),
                username: string().required('required'),
                bio: string().required('required'),
                image: string().required('required'),
                password: string(),
              })}
              onSubmit={(values, { setSubmitting }) => {
                mutate(values, {
                  onSuccess: () => {
                    navigate(PATH_PAGE.profile.root(user!.username));
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
                        name="image"
                        className="form-control"
                        type="text"
                        placeholder="URL of profile picture"
                      />
                      <ErrorMessage name="image" />
                    </fieldset>
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
                        name="bio"
                        as="textarea"
                        className="form-control form-control-lg"
                        rows={8}
                        placeholder="Short bio about you"
                      />
                      <ErrorMessage name="bio" />
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
                    >
                      Update Settings
                    </button>
                  </fieldset>
                </Form>
              )}
            </Formik>

            <hr />

            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

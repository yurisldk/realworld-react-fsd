import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { withErrorBoundary } from 'react-error-boundary';
import {
  sessionContracts,
  sessionQueries,
  sessionTypes,
} from '~entities/session';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';

function Page() {
  const { data: user } = useSuspenseQuery(
    sessionQueries.userService.queryOptions(),
  );

  const {
    mutate: updateUser,
    isPending,
    isError,
    error,
  } = sessionQueries.useUpdateUserMutation();

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            {isError && <ErrorHandler error={error} />}

            <Formik
              enableReinitialize
              initialValues={{ ...initialUser, ...user }}
              validate={formikContract(sessionContracts.UpdateUserDtoSchema)}
              onSubmit={({ form, ...updatedUser }) =>
                updateUser({ user: updatedUser })
              }
              initialTouched={{ form: true }}
            >
              <Form>
                <fieldset disabled={isPending}>
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
                  <fieldset className="form-group">
                    <Field name="form" type="hidden" />
                    <ErrorMessage name="form" />
                  </fieldset>
                  <SubmitButton />
                </fieldset>
              </Form>
            </Formik>

            <hr />

            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

const initialUser: sessionTypes.UpdateUserDto & { form: string } = {
  form: '',
  email: '',
  username: '',
  bio: '',
  image: '',
  password: '',
};

function LogoutButton() {
  const { mutate: logout } = sessionQueries.useLogoutMutation();

  const handleClick = () => {
    logout();
  };

  return (
    <button
      className="btn btn-outline-danger"
      type="button"
      onClick={handleClick}
    >
      Or click here to logout.
    </button>
  );
}

function SubmitButton() {
  const { isValidating, isValid } = useFormikContext();

  return (
    <button
      className="btn btn-lg btn-primary pull-xs-right"
      type="submit"
      disabled={!isValid || isValidating}
    >
      Update Settings
    </button>
  );
}

export const SettingsPage = withErrorBoundary(Page, {
  fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});

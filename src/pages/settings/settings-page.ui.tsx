import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import {
  sessionContracts,
  sessionQueries,
  sessionTypes,
} from '~entities/session';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';

export function SettingsPage() {
  const { data: currentUser } = sessionQueries.useCurrentUserQuery();

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
              initialValues={{ ...initialUser, ...currentUser }}
              validate={formikContract(sessionContracts.UpdateUserDtoSchema)}
              onSubmit={({ form, ...user }) => updateUser(user)}
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

const LogoutButton = () => {
  const { mutate } = sessionQueries.useLogoutMutation();

  const handleClick = () => {
    mutate();
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
};

const SubmitButton = () => {
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
};

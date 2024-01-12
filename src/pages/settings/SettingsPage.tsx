import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  sessionApi,
  sessionContracts,
  sessionModel,
  sessionTypes,
} from '~entities/session';
import { PATH_PAGE } from '~shared/lib/react-router';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';

export function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: sessionApi.CURRENT_USER_KEY,
    queryFn: sessionApi.currentUserQuery,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: sessionApi.UPDATE_USER_KEY,
    mutationFn: sessionApi.updateUserMutation,
    onMutate: (updateUser) => {
      const prevUser = queryClient.getQueryData(sessionApi.CURRENT_USER_KEY);
      queryClient.setQueryData(sessionApi.CURRENT_USER_KEY, updateUser);
      return prevUser as sessionTypes.User;
    },
    onError: (_error, _variables, prevUser) => {
      if (!prevUser) return;
      queryClient.setQueryData(sessionApi.CURRENT_USER_KEY, prevUser);
    },
    onSuccess: (user) => {
      navigate(PATH_PAGE.profile.root(user.username));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: sessionApi.CURRENT_USER_KEY,
      });
    },
  });

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
              onSubmit={({ form, ...updateUser }) => mutate(updateUser)}
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
  const queryClient = useQueryClient();
  const updateToken = sessionModel.useUpdateToken();

  const handleClick = () => {
    updateToken(null);
    queryClient.removeQueries({ queryKey: sessionApi.CURRENT_USER_KEY });
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

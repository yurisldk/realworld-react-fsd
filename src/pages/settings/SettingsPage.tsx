import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import { sessionApi, sessionModel, sessionTypes } from '~entities/session';
import { PATH_PAGE } from '~shared/lib/react-router';

function LogoutButton() {
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
}

const initialUser = {
  email: '',
  token: '',
  username: '',
  bio: '',
  image: '',
  password: '',
};

export function SettingsPage() {
  // TODO: add loading, error, etc... states
  const { data: currentUser, isPending: isUserPending } = useQuery({
    queryKey: sessionApi.CURRENT_USER_KEY,
    queryFn: sessionApi.currentUserQuery,
  });

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: sessionApi.UPDATE_USER_KEY,
    mutationFn: sessionApi.updateUserMutation,
    onMutate: async (updateUser) => {
      const queryKey = sessionApi.CURRENT_USER_KEY;
      await queryClient.cancelQueries({ queryKey });

      const prevUser = queryClient.getQueryData<sessionTypes.User>(queryKey);

      queryClient.setQueryData<sessionTypes.UpdateUserDto>(
        queryKey,
        updateUser,
      );

      return { queryKey, prevUser };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData(context.queryKey, context.prevUser);
    },
    onSuccess: () => {
      navigate(PATH_PAGE.profile.root(currentUser!.username));
    },
    onSettled: (_data, _error, _valiables, context) => {
      if (!context) return;
      queryClient.invalidateQueries({ queryKey: context.queryKey });
    },
  });

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            {/* FIXME: */}
            {isError && <div>{error.message}</div>}

            <Formik
              enableReinitialize
              initialValues={{
                ...initialUser,
                ...currentUser,
              }}
              validationSchema={object().shape({
                email: string().email(),
                token: string(),
                username: string().min(5),
                bio: string(),
                image: string(),
                password: string().min(5),
              })}
              onSubmit={mutate}
            >
              <Form>
                <fieldset disabled={isPending || isUserPending}>
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
            </Formik>

            <hr />

            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

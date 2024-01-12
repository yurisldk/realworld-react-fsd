import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import {
  sessionApi,
  sessionContracts,
  sessionModel,
  sessionTypes,
} from '~entities/session';
import { PATH_PAGE } from '~shared/lib/react-router';

const initialUser = {
  email: '',
  password: '',
};

export function LoginPage() {
  const queryClient = useQueryClient();

  const updateToken = sessionModel.useUpdateToken();

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: sessionApi.LOGIN_USER_KEY,
    mutationFn: sessionApi.loginUserMutation,
    onSuccess: (user) => {
      updateToken(user.token);
      queryClient.setQueryData<sessionTypes.User>(
        sessionApi.CURRENT_USER_KEY,
        user,
      );
      queryClient.invalidateQueries({
        queryKey: sessionApi.CURRENT_USER_KEY,
      });
    },
  });

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
              initialValues={initialUser}
              // FIXME:
              validate={(user) => {
                const errors: Record<string, string> = {};

                const parsed =
                  sessionContracts.LoginUserDtoSchema.safeParse(user);

                if (parsed.success) return errors;

                parsed.error.errors.forEach((e) => {
                  e.path.forEach((path) => {
                    errors[path as string] = e.message;
                  });
                });

                return errors;
              }}
              onSubmit={(users) => mutate(users)}
            >
              <Form>
                <fieldset disabled={isPending}>
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
                    disabled={isPending}
                  >
                    Sign in
                  </button>
                </fieldset>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

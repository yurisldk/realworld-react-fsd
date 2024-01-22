import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { Link } from 'react-router-dom';
import {
  sessionApi,
  sessionContracts,
  sessionModel,
  sessionTypes,
} from '~entities/session';
import { PATH_PAGE } from '~shared/lib/react-router';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';

export function RegisterPage() {
  const queryClient = useQueryClient();
  const updateToken = sessionModel.useUpdateToken();

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: sessionApi.CREATE_USER_KEY,
    mutationFn: sessionApi.createUserMutation,
    onSuccess: async (user) => {
      updateToken(user.token);
      queryClient.setQueryData<sessionTypes.User>(
        sessionApi.CURRENT_USER_KEY,
        user,
      );
      await queryClient.invalidateQueries({
        queryKey: sessionApi.CURRENT_USER_KEY,
      });
    },
  });

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to={PATH_PAGE.login}>Have an account?</Link>
            </p>

            {isError && <ErrorHandler error={error} />}

            <Formik
              initialValues={initialUser}
              validate={formikContract(sessionContracts.CreateUserDtoSchema)}
              onSubmit={(createUser) => mutate(createUser)}
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

const SubmitButton = () => {
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
};

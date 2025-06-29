import { Suspense } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { sessionQueryOptions } from '~entities/session/session.api';
import { UpdateUserSchema } from './update.contracts';
import { useUpdateSessionMutation } from './update.mutation';
import UpdateSessionFormSkeleton from './update.skeleton';
import { UpdateUser } from './update.types';

export default function UpdateSessionForm() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<UpdateSessionFormSkeleton />}>
        <BaseUpdateSessionForm />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseUpdateSessionForm() {
  const navigate = useNavigate();

  const { data: user } = useSuspenseQuery(sessionQueryOptions);
  const { username, email, bio, image } = user;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdateUser>({
    mode: 'onTouched',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: { username, email, bio, image, password: '' },
  });

  const { mutate, isPending, isError, error } = useUpdateSessionMutation({
    onSuccess: (session) => {
      navigate(pathKeys.profile.byUsername(session.username), { replace: true });
    },
  });

  const mutationErrors = error?.response?.data || [error?.message];
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (updateUser: UpdateUser) => {
    mutate(updateUser);
  };

  return (
    <>
      {isError && (
        <ul className="error-messages">
          {mutationErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit(onValid)} data-test="settings-form">
        <fieldset>
          <fieldset className="form-group" disabled={isPending}>
            <input
              className="form-control"
              type="text"
              placeholder="URL of profile picture"
              data-test="settings-image"
              {...register('image')}
            />
            <ErrorMessage errors={errors} name="image" />
          </fieldset>
          <fieldset className="form-group" disabled={isPending}>
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Your Name"
              data-test="settings-username"
              {...register('username')}
            />
            <ErrorMessage errors={errors} name="username" />
          </fieldset>
          <fieldset className="form-group" disabled={isPending}>
            <textarea
              className="form-control form-control-lg"
              rows={8}
              placeholder="Short bio about you"
              data-test="settings-bio"
              {...register('bio')}
            />
            <ErrorMessage errors={errors} name="bio" />
          </fieldset>
          <fieldset className="form-group" disabled={isPending}>
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Email"
              data-test="settings-email"
              {...register('email')}
            />
            <ErrorMessage errors={errors} name="email" />
          </fieldset>
          <fieldset className="form-group" disabled={isPending}>
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="Password"
              data-test="settings-password"
              {...register('password')}
            />
            <ErrorMessage errors={errors} name="password" />
          </fieldset>

          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={!canSubmit}
            data-test="settings-submit"
          >
            Update Settings
          </button>
        </fieldset>
      </form>
    </>
  );
}

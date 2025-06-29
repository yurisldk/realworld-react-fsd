import { Suspense } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { sessionQueryOptions } from '~entities/session/session.api';
import { CreateCommentSchema } from './create-comment.contracts';
import { useCreateCommentMutation } from './create-comment.mutation';
import { CreateCommentFormSkeleton } from './create-comment.skeleton';
import { CreateComment } from './create-comment.types';

type CreateCommentFormProps = {
  slug: string;
};

export function CreateCommentForm(props: CreateCommentFormProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<CreateCommentFormSkeleton />}>
        <BaseCreateCommentForm {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseCreateCommentForm(props: CreateCommentFormProps) {
  const { slug } = props;

  const { data: user } = useSuspenseQuery(sessionQueryOptions);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateComment>({
    mode: 'onChange',
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: { slug, body: '' },
  });

  const { mutate, isPending, isError, error } = useCreateCommentMutation({
    mutationKey: [slug],
    onSuccess: () => {
      setValue('body', '');
    },
  });

  const mutationErrors = error?.response?.data || [error?.message];
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (createComment: CreateComment) => {
    mutate(createComment);
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

      <form className="card comment-form" onSubmit={handleSubmit(onValid)}>
        <div className="card-block">
          <fieldset>
            <textarea
              className="form-control"
              placeholder="Write a comment..."
              rows={3}
              disabled={isPending}
              data-test="comment-input"
              {...register('body')}
            />
            <ErrorMessage errors={errors} name="body" as="div" role="alert" />
          </fieldset>
        </div>
        <div className="card-footer">
          <img src={user.image} className="comment-author-img" alt={user.username} />

          <button className="btn btn-sm btn-primary" type="submit" disabled={!canSubmit} data-test="comment-submit">
            Post Comment
          </button>
        </div>
      </form>
    </>
  );
}

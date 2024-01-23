import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { withErrorBoundary } from 'react-error-boundary';
import { Link, useParams } from 'react-router-dom';
import {
  commentContracts,
  commentQueries,
  commentTypes,
} from '~entities/comment';
import { sessionQueries } from '~entities/session';
import { withSuspense } from '~shared/lib/react';
import { pathKeys, routerTypes } from '~shared/lib/react-router';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';
import { Loader } from '~shared/ui/loader';

function CommentForm() {
  const { slug } = useParams() as routerTypes.SlugPageParams;

  const { data: user } = useSuspenseQuery(
    sessionQueries.userService.queryOptions(),
  );

  const {
    mutate: createComment,
    isError,
    error,
  } = commentQueries.useCreateCommentMutation(slug);

  if (!user)
    return (
      <p>
        <Link to={pathKeys.login()}>Sign in</Link> or{' '}
        <Link to={pathKeys.register()}>sign up</Link> to add comments on this
        article.
      </p>
    );

  const { image, username } = user;

  return (
    <>
      {isError && <ErrorHandler error={error} size="small" />}
      <Formik
        enableReinitialize
        initialValues={initialComment}
        validate={formikContract(commentContracts.CreateCommentDtoSchema)}
        onSubmit={(comment, { resetForm, setFieldValue }) => {
          resetForm();
          createComment(
            { slug, comment },
            {
              onError: () => {
                setFieldValue('body', comment.body);
              },
            },
          );
        }}
      >
        <Form className="card comment-form">
          <fieldset>
            <div className="card-block">
              <Field
                name="body"
                as="textarea"
                className="form-control"
                placeholder="Write a comment..."
                rows={3}
              />
              <ErrorMessage name="body" />
            </div>
            <div className="card-footer">
              <img src={image} className="comment-author-img" alt={username} />
              <SubmitButton />
            </div>
          </fieldset>
        </Form>
      </Formik>
    </>
  );
}

const initialComment: commentTypes.CreateCommentDto = { body: '' };

function SubmitButton() {
  const { isValidating, isValid } = useFormikContext();

  return (
    <button
      className="btn btn-sm btn-primary"
      type="submit"
      disabled={!isValid || isValidating}
    >
      Post Comment
    </button>
  );
}

const SuspensedCommentForm = withSuspense(CommentForm, {
  fallback: <Loader />,
});
export const CreateCommentForm = withErrorBoundary(SuspensedCommentForm, {
  fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});

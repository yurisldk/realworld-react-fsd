import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { Link, useParams } from 'react-router-dom';
import {
  commentContracts,
  commentQueries,
  commentTypes,
} from '~entities/comment';
import { sessionQueries } from '~entities/session';
import { pathKeys, routerTypes } from '~shared/lib/react-router';
import { formikContract } from '~shared/lib/zod';

export function CreateCommentForm() {
  const { slug } = useParams() as routerTypes.SlugPageParams;

  const { data: user } = useQuery(sessionQueries.currentUserQueryOptions());

  const { mutate: createComment, isPending } =
    commentQueries.useCreateCommentMutation(slug);

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
    <Formik
      enableReinitialize
      initialValues={initialComment}
      validate={formikContract(commentContracts.CreateCommentDtoSchema)}
      onSubmit={(comment) => createComment({ slug, comment })}
    >
      <Form className="card comment-form">
        <fieldset disabled={isPending}>
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
  );
}

const initialComment: commentTypes.CreateCommentDto = { body: '' };

const SubmitButton = () => {
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
};

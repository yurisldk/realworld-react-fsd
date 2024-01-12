import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import { commentApi } from '~entities/comment';
import { profileTypes } from '~entities/profile';
import { sessionApi } from '~entities/session';
import { useCreateComment } from '~features/comment';
import { NewCommentDto } from '~shared/api/realworld';
import { PATH_PAGE } from '~shared/lib/react-router';

const initialValues: NewCommentDto = { body: '' };

const validationSchema = object().shape({
  body: string().required('required'),
});

type NewCommentEditorProps = {
  slug: string;
};

export function NewCommentEditor(props: NewCommentEditorProps) {
  const { slug } = props;

  // TODO: add loading, error, etc... states
  const { data: user } = useQuery({
    queryKey: sessionApi.CURRENT_USER_KEY,
    queryFn: sessionApi.currentUserQuery,
  });

  const queryClient = useQueryClient();

  const { mutate } = useCreateComment(queryClient);

  if (!user)
    return (
      <p>
        <Link to={PATH_PAGE.login}>Sign in</Link> or{' '}
        <Link to={PATH_PAGE.register}>sign up</Link> to add comments on this
        article.
      </p>
    );

  const { image, username } = user;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const { token, ...other } = user;
        const author: profileTypes.Profile = { ...other, following: false };

        const newComment: commentApi.Comment = {
          id: +Infinity,
          createdAt: dayjs().toISOString(),
          updatedAt: dayjs().toISOString(),
          body: values.body,
          author,
        };

        mutate(
          { slug, newComment },
          {
            onSuccess: () => {
              resetForm();
            },
            onSettled: () => {
              setSubmitting(false);
            },
          },
        );
      }}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="card comment-form">
          <fieldset disabled={isSubmitting}>
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
              <button className="btn btn-sm btn-primary" type="submit">
                Post Comment
              </button>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
}

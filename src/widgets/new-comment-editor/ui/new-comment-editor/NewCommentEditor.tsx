import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { Link } from 'react-router-dom';
import { commentApi, commentContracts, commentTypes } from '~entities/comment';
import { profileTypes } from '~entities/profile';
import { sessionApi } from '~entities/session';
import { PATH_PAGE } from '~shared/lib/react-router';
import { formikContract } from '~shared/lib/zod';

type NewCommentEditorProps = { slug: string };

export function NewCommentEditor(props: NewCommentEditorProps) {
  const { slug } = props;
  const queryClient = useQueryClient();
  const commentsKey = [...commentApi.COMMENTS_KEY, slug];

  // TODO: add loading, error, etc... states
  const { data: user } = useQuery({
    queryKey: sessionApi.CURRENT_USER_KEY,
    queryFn: sessionApi.currentUserQuery,
  });

  const { mutate: createComment, isPending } = useMutation({
    mutationKey: [...commentApi.CREATE_COMMENT_KEY, slug],
    mutationFn: commentApi.createCommentMutation,
    onMutate: async ({ comment }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const { token, ...other } = user!;
      const author: profileTypes.Profile = { ...other, following: false };

      const newComment: commentTypes.Comment = {
        id: +Infinity,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        body: comment.body,
        author,
      };

      const prevComments =
        queryClient.getQueryData<commentTypes.Comments>(commentsKey) || [];

      const newComments = [...prevComments, newComment];

      queryClient.setQueryData<commentTypes.Comments>(commentsKey, newComments);

      return prevComments;
    },
    onError: (_error, _variables, prevComments) => {
      if (!prevComments) return;
      queryClient.setQueryData(commentsKey, prevComments);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });

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

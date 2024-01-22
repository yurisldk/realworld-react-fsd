import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { useNavigate } from 'react-router-dom';
import { articleApi, articleContracts, articleTypes } from '~entities/article';
import { pathKeys } from '~shared/lib/react-router';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';

export function CreateArticeForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: createArticle,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: articleApi.CREATE_ARTICLE_KEY,
    mutationFn: articleApi.createArticleMutation,
    onSuccess: (article) => {
      queryClient.setQueryData(
        [...articleApi.ARTICLE_KEY, article.slug],
        article,
      );
      navigate(pathKeys.article.bySlug(article.slug));
    },
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialArticle}
      validate={formikContract(articleContracts.CreateArticleSchema)}
      onSubmit={(createArticleDto) => createArticle(createArticleDto)}
    >
      <Form>
        {isError && <ErrorHandler error={error} />}
        <fieldset disabled={isPending}>
          <fieldset className="form-group">
            <Field
              name="title"
              type="text"
              className="form-control form-control-lg"
              placeholder="Article Title"
            />
            <ErrorMessage name="title" />
          </fieldset>
          <fieldset className="form-group">
            <Field
              name="description"
              type="text"
              className="form-control"
              placeholder="What's this article about?"
            />
            <ErrorMessage name="description" />
          </fieldset>
          <fieldset className="form-group">
            <Field
              name="body"
              as="textarea"
              className="form-control"
              rows={8}
              placeholder="Write your article (in markdown)"
            />
            <ErrorMessage name="body" />
          </fieldset>
          <fieldset className="form-group">
            <Field
              name="tagList"
              type="text"
              className="form-control"
              placeholder="Enter tags"
            />
            <ErrorMessage name="tagList" />
            <div className="tag-list" />
          </fieldset>
          <SubmitButton />
        </fieldset>
      </Form>
    </Formik>
  );
}

const initialArticle: articleTypes.CreateArticle = {
  title: '',
  description: '',
  body: '',
  tagList: '',
};

const SubmitButton = () => {
  const { isValidating, isValid } = useFormikContext();

  return (
    <button
      className="btn btn-lg pull-xs-right btn-primary"
      type="submit"
      disabled={!isValid || isValidating}
    >
      Publish Article
    </button>
  );
};

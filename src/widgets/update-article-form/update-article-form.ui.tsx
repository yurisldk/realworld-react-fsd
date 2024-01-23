import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { withErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import {
  articleContracts,
  articleLib,
  articleQueries,
  articleTypes,
} from '~entities/article';
import { withSuspense } from '~shared/lib/react';
import { routerTypes } from '~shared/lib/react-router';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';
import { Loader } from '~shared/ui/loader';

function ArticleForm() {
  const { slug } = useParams() as routerTypes.SlugPageParams;

  const { data: currentArticle } = useSuspenseQuery(
    articleQueries.articleService.queryOptions(slug),
  );

  const {
    mutate: updateArticle,
    isPending,
    isError,
    error,
  } = articleQueries.useUpdateArticleMutation(slug);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...initialArticle,
        ...articleLib.mapUpdateArticle(currentArticle),
      }}
      validate={formikContract(articleContracts.UpdateArticleSchema)}
      onSubmit={(article) => updateArticle({ slug, article })}
      initialTouched={{ form: true }}
    >
      <Form>
        {isError && <ErrorHandler error={error} size="small" />}
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
          <fieldset className="form-group">
            <Field name="form" type="hidden" />
            <ErrorMessage name="form" />
          </fieldset>
          <SubmitButton />
        </fieldset>
      </Form>
    </Formik>
  );
}

const initialArticle: articleTypes.UpdateArticle & { form: string } = {
  form: '',
  title: '',
  description: '',
  body: '',
  tagList: '',
};

function SubmitButton() {
  const { isValidating, isValid } = useFormikContext();

  return (
    <button
      className="btn btn-lg pull-xs-right btn-primary"
      type="submit"
      disabled={!isValid || isValidating}
    >
      Update Article
    </button>
  );
}

const SuspensedArticleForm = withSuspense(ArticleForm, {
  fallback: <Loader />,
});
export const UpdateArticleForm = withErrorBoundary(SuspensedArticleForm, {
  fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});

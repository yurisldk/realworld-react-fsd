import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  articleApiTest,
  articleContracts,
  articleTypes,
} from '~entities/article';
import { PATH_PAGE } from '~shared/lib/react-router';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';

export function NewArticleEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: createArticle,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: articleApiTest.CREATE_ARTICLE_KEY,
    mutationFn: articleApiTest.createArticleMutation,
    onSuccess: (article) => {
      queryClient.setQueryData(
        [...articleApiTest.ARTICLE_KEY, article.slug],
        article,
      );
      navigate(PATH_PAGE.article.slug(article.slug));
    },
  });

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {isError && <ErrorHandler error={error} />}

            <Formik
              enableReinitialize
              initialValues={initialArticle}
              validate={formikContract(articleContracts.CreateArticleSchema)}
              onSubmit={(createArticleDto) => createArticle(createArticleDto)}
            >
              <Form>
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
          </div>
        </div>
      </div>
    </div>
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

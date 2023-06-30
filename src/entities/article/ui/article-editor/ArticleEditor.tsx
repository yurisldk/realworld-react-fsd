import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { GenericErrorModel } from '~shared/api/realworld';
import { ErrorHandler } from '~shared/ui/error-handler';

type EditorArticle = {
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
};

type FormikArticle = {
  title?: string;
  description?: string;
  body?: string;
  tagList?: string;
};

type ArticleEditorProps = {
  article?: EditorArticle;
  validationSchema: any | (() => any);
  isLoading: boolean;
  isError: boolean;
  error: GenericErrorModel | null;
  onSubmit: (
    values: EditorArticle,
    helpers: FormikHelpers<FormikArticle>,
  ) => void;
};

const initialArticle: EditorArticle = {
  title: '',
  description: '',
  body: '',
  tagList: [''],
};

function mapFormikArticle(article: FormikArticle): EditorArticle {
  const tagList = article?.tagList && article.tagList.split(', ');
  return { ...article, tagList } as EditorArticle;
}

function mapEditorArticle(article: EditorArticle): FormikArticle {
  const tagList = article?.tagList && article.tagList.join(', ');
  return { ...article, tagList };
}

export function ArticleEditor(props: ArticleEditorProps) {
  const {
    article = initialArticle,
    validationSchema,
    isLoading,
    isError,
    error,
    onSubmit,
  } = props;

  const formikArticle = mapEditorArticle(article);

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {isError && <ErrorHandler error={error!} />}

            <Formik
              initialValues={formikArticle}
              validationSchema={validationSchema}
              onSubmit={(newFormikArticle, formikHelpers) => {
                const editorArticle = mapFormikArticle(newFormikArticle);
                onSubmit(editorArticle, formikHelpers);
              }}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <fieldset disabled={isSubmitting || isLoading}>
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
                    <button
                      className="btn btn-lg pull-xs-right btn-primary"
                      type="submit"
                    >
                      Publish Article
                    </button>
                  </fieldset>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import {
  GenericErrorModelDto,
  NewArticleDto,
  UpdateArticleDto,
} from '~shared/api/realworld';
import { ErrorsList } from '~shared/ui/errors-list';

type ArticleEditorProps = {
  article?: NewArticleDto | UpdateArticleDto;
  isLoading: boolean;
  isError: boolean;
  error?: GenericErrorModelDto;
  onSubmit: (
    values: NewArticleDto | UpdateArticleDto,
    helpers: FormikHelpers<NewArticleDto | UpdateArticleDto>,
  ) => void;
};

// TODO: add correct validation
const validationSchema = object().shape({
  title: string().required('required'),
  description: string().required('required'),
  body: string().required('required'),
  tagList: string().required('required'),
});

const initialArticle: NewArticleDto = {
  title: '',
  description: '',
  body: '',
  tagList: [''],
};

export function ArticleEditor(props: ArticleEditorProps) {
  const { article, isLoading, isError, error, onSubmit } = props;

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {isError && <ErrorsList errors={error!.errors} />}

            <Formik
              initialValues={article || initialArticle}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
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

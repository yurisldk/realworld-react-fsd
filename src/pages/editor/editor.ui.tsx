import { Suspense } from 'react';
import { Await, Form, useActionData, useLoaderData, useNavigation } from 'react-router';
import type { SingleArticleResponse } from '~shared/api/generated/schemas/singleArticleResponse.zod';
import { AsyncErrorCard } from '~shared/ui/async-error-card/async-error-card.ui';
import { ErrorMessages } from '~shared/ui/error-messages/error-messages.ui';
import { Spinner } from '~shared/ui/spinner/spinner.ui';
import type { ArticleCreateActionData } from './actions/article-create.action';
import type { ArticleUpdateActionData } from './actions/article-update.action';
import type { EditorPageLoaderData } from './editor.loader';

export function EditorCreatePage() {
  return <EditorForm />;
}

export function EditorUpdatePage() {
  const { articlePromise } = useLoaderData<EditorPageLoaderData>();

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={articlePromise} errorElement={<EditorContentError />}>
        {({ article }) => <EditorForm article={article} />}
      </Await>
    </Suspense>
  );
}

type EditorFormProps = {
  article?: SingleArticleResponse['article'];
};

function EditorForm({ article }: EditorFormProps) {
  const actionData = useActionData<ArticleCreateActionData | ArticleUpdateActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const title = article?.title ?? '';
  const description = article?.description ?? '';
  const body = article?.body ?? '';
  const tagListText = article?.tagList?.join(' ') ?? '';

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {actionData && !actionData.ok && <ErrorMessages errors={actionData.errors} />}

            <Form method="POST">
              <fieldset disabled={isSubmitting}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="title"
                    placeholder="Article Title"
                    defaultValue={title}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    name="description"
                    placeholder="What's this article about?"
                    defaultValue={description}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    name="body"
                    placeholder="Write your article (in markdown)"
                    defaultValue={body}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    name="tagList"
                    placeholder="Enter tags"
                    defaultValue={tagListText}
                  />
                </fieldset>
                <button className="btn btn-lg pull-xs-right btn-primary" type="submit" disabled={isSubmitting}>
                  Publish Article
                </button>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorContentError() {
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <AsyncErrorCard title="Could not load article" fallbackMessage="Try again later." />
          </div>
        </div>
      </div>
    </div>
  );
}

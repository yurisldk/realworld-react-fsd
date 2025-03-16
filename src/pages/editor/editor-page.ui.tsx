import { ReactNode } from 'react';
import { useLoaderData } from 'react-router-dom';
import { CreateArticleForm } from '~features/article/create-article/create-article.ui';
import { UpdateArticleForm } from '~features/article/update-article/update-article.ui';
import { EditorLoaderArgs } from './editor-page.loader';

export function CreateEditorPage() {
  return (
    <EditorPageWrapper>
      <CreateArticleForm />
    </EditorPageWrapper>
  );
}

export function UpdateEditorPage() {
  const { params } = useLoaderData() as EditorLoaderArgs;
  const { slug } = params;

  return (
    <EditorPageWrapper>
      <UpdateArticleForm slug={slug} />
    </EditorPageWrapper>
  );
}

function EditorPageWrapper(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">{children}</div>
        </div>
      </div>
    </div>
  );
}

import { useParams } from 'react-router-dom';
import { CurrentArticleEditor } from '~widgets/current-article-editor';
import { NewArticleEditor } from '~widgets/new-article-editor';

type EditorPageProps = {
  edit?: boolean;
};

export function EditorPage(props: EditorPageProps) {
  const { edit } = props;
  const { slug } = useParams();

  return (
    <>
      {edit && <CurrentArticleEditor slug={slug!} />}
      {!edit && <NewArticleEditor />}
    </>
  );
}

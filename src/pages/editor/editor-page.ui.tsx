import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { CreateArticeForm } from '~widgets/create-article-form';
import { UpdateArticleForm } from '~widgets/update-article-form';

export const EditorPageParamsSchema = z.object({ slug: z.string() });
export type EditorPageParams = z.infer<typeof EditorPageParamsSchema>;

export function EditorPage() {
  const { slug } = useParams();

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {slug ? <UpdateArticleForm slug={slug} /> : <CreateArticeForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

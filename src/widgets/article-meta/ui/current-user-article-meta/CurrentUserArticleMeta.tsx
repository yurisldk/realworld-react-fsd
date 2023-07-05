import { IoPencil } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { ArticleMeta, articleApi } from '~entities/article';
import { DeleteArticleButton } from '~features/article';
import { PATH_PAGE } from '~shared/lib/react-router';

type CurrentUserArticleMetaProps = {
  slug: string;
  article: articleApi.Article;
};

export function CurrentUserArticleMeta(props: CurrentUserArticleMetaProps) {
  const { slug, article } = props;

  return (
    <ArticleMeta
      article={article}
      actionSlot={
        <>
          <Link
            className="btn btn-outline-secondary btn-sm"
            to={PATH_PAGE.editor.edit(slug)}
          >
            <IoPencil size={16} />
            &nbsp;Edit Article
          </Link>
          &nbsp;&nbsp;
          <DeleteArticleButton slug={slug} />
        </>
      }
    />
  );
}

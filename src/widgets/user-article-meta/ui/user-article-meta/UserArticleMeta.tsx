import { Link } from 'react-router-dom';
import { ArticleMeta } from '~entities/article';
import { ArticleDto } from '~shared/api/realworld';
import { PATH_PAGE } from '~shared/lib/react-router';

type UserArticleMetaProps = {
  slug: string;
  article: ArticleDto;
};

export function UserArticleMeta(props: UserArticleMetaProps) {
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
            <i className="ion-edit" /> Edit Article
          </Link>
          &nbsp;&nbsp;
          <button className="btn btn-outline-danger btn-sm" type="button">
            <i className="ion-trash-a" /> Delete Article
          </button>
        </>
      }
    />
  );
}

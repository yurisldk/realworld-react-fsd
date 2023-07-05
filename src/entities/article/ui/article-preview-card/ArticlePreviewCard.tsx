import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { Article } from '../../api/articleApi';

type ArticlePreviewCardProps = {
  article: Article;
  meta?: ReactNode;
};

export function ArticlePreviewCard(props: ArticlePreviewCardProps) {
  const { article, meta } = props;
  const { title, description, slug } = article;

  return (
    <div className="article-preview">
      {meta}
      <Link to={PATH_PAGE.article.slug(slug)} className="preview-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}

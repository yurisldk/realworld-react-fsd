import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { Article } from './article.types';

type PreviewCardProps = {
  article: Article;
  favoriteAction: ReactNode;
  unfavoriteAction: ReactNode;
};

export function PreviewCard(props: PreviewCardProps) {
  const { article, favoriteAction, unfavoriteAction } = props;

  const { author, description, favorited, slug, title, updatedAt } = article;
  const { image, username } = author;

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={PATH_PAGE.profile.root(username)}>
          <img src={image} alt={username} />
        </Link>
        <div className="info">
          <Link to={PATH_PAGE.profile.root(username)} className="author">
            {username}
          </Link>
          <span className="date">{updatedAt}</span>
        </div>
        {favorited ? favoriteAction : unfavoriteAction}
        <Link to={PATH_PAGE.article.slug(slug)} className="preview-link">
          <h1>{title}</h1>
          <p>{description}</p>
          <span>Read more...</span>
        </Link>
      </div>
    </div>
  );
}

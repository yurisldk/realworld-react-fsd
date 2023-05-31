import { ReactNode } from 'react';
import dayjs from 'dayjs';
import { conduitApi } from '~shared/api';

type ArticlePreviewCardProps = {
  article: conduitApi.ArticleDto;
  actionSlot?: ReactNode;
};

// TODO: add slot for feature
export function ArticlePreviewCard(props: ArticlePreviewCardProps) {
  const { article, actionSlot } = props;
  const { title, description, createdAt, author } = article;
  const { username, image } = author;

  const formatedDate = dayjs(createdAt).format('MMMM D, YYYY');

  return (
    <div className="article-preview">
      <div className="article-meta">
        <a href="profile.html">
          <img src={image} alt={username} />
        </a>
        <div className="info">
          <a href="/#" className="author">
            {username}
          </a>
          <span className="date">{formatedDate}</span>
        </div>
        {actionSlot}
      </div>
      <a href="/#" className="preview-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
      </a>
    </div>
  );
}

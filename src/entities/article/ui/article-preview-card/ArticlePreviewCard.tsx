import { ReactNode } from 'react';
import dayjs from 'dayjs';

type ArticlePreviewCardProps = {
  authorName: string;
  authorAvatar: string;
  createdAt: DateIso;
  title: string;
  description: string;
  actionSlot?: ReactNode;
};

// TODO: add slot for feature
export function ArticlePreviewCard(props: ArticlePreviewCardProps) {
  const {
    authorName,
    authorAvatar,
    createdAt,
    title,
    description,
    actionSlot,
  } = props;

  const formatedDate = dayjs(createdAt).format('MMMM D, YYYY');

  return (
    <div className="article-preview">
      <div className="article-meta">
        <a href="profile.html">
          <img src={authorAvatar} alt={authorName} />
        </a>
        <div className="info">
          <a href="/#" className="author">
            {authorName}
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

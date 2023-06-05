import { ReactNode } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { ArticleDto } from '~shared/api/realworld';
import { PATH_PAGE } from '~shared/lib/react-router';

type ArticleMetaProps = {
  article: ArticleDto;
  actionSlot?: ReactNode;
};

export function ArticleMeta(props: ArticleMetaProps) {
  const { article, actionSlot } = props;
  const { createdAt, author } = article;
  const { username, image } = author;

  const formatedDate = dayjs(createdAt).format('MMMM D, YYYY');

  return (
    <div className="article-meta">
      <Link to={PATH_PAGE.profile.root(username)}>
        <img src={image} alt={username} />
      </Link>
      <div className="info">
        <Link to={PATH_PAGE.profile.root(username)} className="author">
          {username}
        </Link>
        <span className="date">{formatedDate}</span>
      </div>
      {actionSlot}
    </div>
  );
}

import { ReactNode } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { Comment } from '../../comment.types';

type CommentCardProps = {
  comment: Comment;
  actions?: ReactNode;
};

export function CommentCard(props: CommentCardProps) {
  const { comment, actions } = props;
  const { createdAt } = comment;

  const formatedDate = dayjs(createdAt).format('MMMM D, YYYY');

  return (
    <div key={comment.id} className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link
          to={pathKeys.profile.byUsername({
            username: comment.author.username,
          })}
          className="comment-author"
        >
          <img
            src={comment.author.image}
            className="comment-author-img"
            alt={comment.author.username}
          />
        </Link>
        &nbsp;
        <Link
          to={pathKeys.profile.byUsername({
            username: comment.author.username,
          })}
          className="comment-author"
        >
          {comment.author.username}
        </Link>
        <span className="date-posted">{formatedDate}</span>
        {actions}
      </div>
    </div>
  );
}

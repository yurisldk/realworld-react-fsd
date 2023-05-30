import dayjs from 'dayjs';

type ArticlePreviewCardProps = {
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  favoritesCount: number;
  title: string;
  description: string;
};

// TODO: add slot for feature
export function ArticlePreviewCard(props: ArticlePreviewCardProps) {
  const {
    authorName,
    authorAvatar,
    createdAt,
    favoritesCount,
    title,
    description,
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
        {/* FIXME: should be a slot for feature */}
        <button
          className="btn btn-outline-primary btn-sm pull-xs-right"
          type="button"
        >
          <i className="ion-heart" /> {favoritesCount}
        </button>
      </div>
      <a href="/#" className="preview-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
      </a>
    </div>
  );
}

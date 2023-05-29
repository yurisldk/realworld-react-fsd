import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { conduitApi } from '~shared/api';

export function HomePage() {
  const { data: articlesData, isLoading: isArticlesLoading } = useQuery(
    ['articles', 'global'],
    async () => conduitApi.Articles.global(),
  );

  const { data: tagsData, isLoading: isTagsLoading } = useQuery(
    ['tags', 'global'],
    async () => conduitApi.Tags.global(),
  );

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a className="nav-link active" href="/#">
                    Global Feed
                  </a>
                </li>
              </ul>
            </div>

            {isArticlesLoading && (
              <div className="article-preview">Loading articles...</div>
            )}

            {articlesData &&
              articlesData.articles.length &&
              articlesData.articles.map((article) => {
                const {
                  slug,
                  createdAt,
                  favoritesCount,
                  title,
                  description,
                  author,
                } = article;
                const { username, image } = author;

                return (
                  <div key={slug} className="article-preview">
                    <div className="article-meta">
                      <a href="profile.html">
                        <img src={image} alt={username} />
                      </a>
                      <div className="info">
                        <a href="/#" className="author">
                          {username}
                        </a>
                        <span className="date">
                          {dayjs(createdAt).format('MMMM D, YYYY')}
                        </span>
                      </div>
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
              })}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {isTagsLoading && 'Loading tags...'}

                {tagsData &&
                  tagsData.tags.length &&
                  tagsData.tags.map((tag) => (
                    <a key={tag} href="/#" className="tag-pill tag-default">
                      {tag}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

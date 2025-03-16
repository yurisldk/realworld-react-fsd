import { PrimaryFilter, TagFilter } from '~features/article/filter-article/filter-article.ui';
import { ArticlesFeed } from '~widgets/articles-feed/articles-feed.ui';

export default function HomePage() {
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
            <PrimaryFilter />
            <ArticlesFeed />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <TagFilter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

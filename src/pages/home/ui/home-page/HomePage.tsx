import { useQuery } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';
import { GlobalArticlesList } from '~widgets/global-articles-list';

export function HomePage() {
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

            <GlobalArticlesList />
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

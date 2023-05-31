import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';
import { GlobalArticlesList } from '~widgets/global-articles-list';
import { UserFeedArticlesList } from '~widgets/user-feed-articles-list';

export function HomePage() {
  const { data: tagsData, isLoading: isTagsLoading } = useQuery(
    ['tags', 'global'],
    async () => conduitApi.Tags.global(),
  );

  const [tab, setTab] = useState(0);

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
                  <a
                    className={`nav-link ${tab === 0 && 'active'}`}
                    href="/#"
                    onClick={() => setTab(0)}
                  >
                    Your Feed
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${tab === 1 && 'active'}`}
                    href="/#"
                    onClick={() => setTab(1)}
                  >
                    Global Feed
                  </a>
                </li>
              </ul>
            </div>

            {tab === 0 && <UserFeedArticlesList />}
            {tab === 1 && <GlobalArticlesList />}
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

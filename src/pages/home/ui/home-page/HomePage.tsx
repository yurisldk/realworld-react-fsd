import { useReducer } from 'react';
import { useQuery } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';
import { GlobalArticlesList } from '~widgets/global-articles-list';
import { UserFeedArticlesList } from '~widgets/user-feed-articles-list';

type TabsState = {
  userfeed: boolean;
  global: boolean;
  tag: string | boolean;
};

const initialState: TabsState = {
  userfeed: true,
  global: false,
  tag: false,
};

type Action =
  | { type: 'global' }
  | { type: 'userfeed' }
  | { type: 'tag'; payload: boolean | string };

function reducer(_: TabsState, action: Action) {
  switch (action.type) {
    case 'userfeed':
      return { userfeed: true, global: false, tag: false };
    case 'global':
      return { userfeed: false, global: true, tag: false };
    case 'tag':
      return { userfeed: false, global: false, tag: action.payload };
    default:
      throw new Error();
  }
}

function toggleGlobal(dispatch: React.Dispatch<Action>) {
  return dispatch({ type: 'global' });
}

function toggleUserfeed(dispatch: React.Dispatch<Action>) {
  return dispatch({ type: 'userfeed' });
}

function toggleTag(dispatch: React.Dispatch<Action>, tag: string) {
  return dispatch({ type: 'tag', payload: tag });
}

export function HomePage() {
  const { data: tagsData, isLoading: isTagsLoading } = useQuery(
    ['tags', 'global'],
    async () => conduitApi.Tags.global(),
  );

  const [tabs, dispatch] = useReducer(reducer, initialState);

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
                    className={`nav-link ${tabs.userfeed && 'active'}`}
                    href="/#"
                    onClick={() => toggleUserfeed(dispatch)}
                  >
                    Your Feed
                  </a>
                </li>
                <li className="nav-item">
                  {/* TODO: remove href */}
                  <a
                    className={`nav-link ${tabs.global && 'active'}`}
                    href="/#"
                    onClick={() => toggleGlobal(dispatch)}
                  >
                    Global Feed
                  </a>
                </li>
                {tabs.tag && (
                  <li className="nav-item">
                    <a
                      className={`nav-link ${tabs.tag && 'active'}`}
                      href="/#"
                      onClick={() => toggleGlobal(dispatch)}
                    >
                      #{tabs.tag}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {tabs.userfeed && <UserFeedArticlesList />}
            {tabs.global && <GlobalArticlesList />}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {isTagsLoading && 'Loading tags...'}

                {tagsData &&
                  tagsData.tags.length &&
                  tagsData.tags.map((tag) => (
                    <a
                      key={tag}
                      href="/#"
                      className="tag-pill tag-default"
                      onClick={() => toggleTag(dispatch, tag)}
                    >
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

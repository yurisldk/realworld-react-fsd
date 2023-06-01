import { useReducer } from 'react';
import { sessionModel } from '~entities/session';
import { tagApi } from '~entities/tag';
import { GlobalArticlesList } from '~widgets/global-articles-list';
import { TagArticlesList } from '~widgets/tag-articles-list';
import { UserFeedArticlesList } from '~widgets/user-feed-articles-list';

type TabsState = {
  userfeed: boolean;
  global: boolean;
  tag: string | boolean;
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
  const isAuth = sessionModel.useAuth();

  const { data: tagsData, isLoading: isTagsLoading } = tagApi.useGlobalTags();

  const initialState: TabsState = {
    userfeed: isAuth,
    global: !isAuth,
    tag: false,
  };

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
                {isAuth && (
                  <li className="nav-item">
                    <button
                      className={`nav-link ${tabs.userfeed && 'active'}`}
                      onClick={() => toggleUserfeed(dispatch)}
                      type="button"
                    >
                      Your Feed
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className={`nav-link ${tabs.global && 'active'}`}
                    onClick={() => toggleGlobal(dispatch)}
                    type="button"
                  >
                    Global Feed
                  </button>
                </li>
                {tabs.tag && (
                  <li className="nav-item">
                    <button
                      className={`nav-link ${tabs.tag && 'active'}`}
                      onClick={() => toggleGlobal(dispatch)}
                      type="button"
                    >
                      #{tabs.tag}
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {isAuth && tabs.userfeed && <UserFeedArticlesList />}
            {tabs.global && <GlobalArticlesList />}
            {tabs.tag && <TagArticlesList tag={tabs.tag as string} />}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {isTagsLoading && 'Loading tags...'}

                {tagsData &&
                  tagsData.tags.length &&
                  tagsData.tags.map((tag) => (
                    <button
                      key={tag}
                      className="tag-pill tag-default"
                      onClick={() => toggleTag(dispatch, tag)}
                      type="button"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

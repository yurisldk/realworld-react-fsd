import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StoreApi } from 'zustand';
import { articleFilterModel } from '~entities/article';
import { FilterArticleTabButton } from '~features/article';
import { CommonArticlesList } from '~widgets/common-articles-list';
import { ProfileCard } from '~widgets/profile-card';
import {
  initialFilterState,
  profilePageArticleFilterStore,
} from '../../model/profilePageArticleFilter';

type ProfilePageProps = {
  model?: StoreApi<articleFilterModel.ArticleFilterState>;
  favorites?: boolean;
};

// TODO: handle error
// TODO: navigate to 404 username that doesnt exists (404)
export function ProfilePage(props: ProfilePageProps) {
  const { model = profilePageArticleFilterStore, favorites } = props;
  const { username } = useParams();

  const filter = articleFilterModel.selectFilter(model);

  /**
   * Not sure that's the best way but the main point is init store with
   * default falues that we can take from prop and react-router params.
   * It works for now, have to check that later. sorry =)
   */
  useLayoutEffect(() => {
    model.setState((state) => ({
      filter: {
        ...state.filter,
        ...(!favorites && { author: username }),
        ...(favorites && { favorited: username }),
      },
    }));

    return () => model.setState(() => ({ filter: initialFilterState }));
  }, []);

  return (
    <div className="profile-page">
      <ProfileCard username={username!} />

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <FilterArticleTabButton
                    model={model}
                    filter={{ author: username }}
                    title="My Articles"
                  />
                </li>
                <li className="nav-item">
                  <FilterArticleTabButton
                    model={model}
                    filter={{ favorited: username }}
                    title="Favorited Articles"
                  />
                </li>
              </ul>
            </div>

            {filter.author && (
              <CommonArticlesList
                model={model}
                queryKey={['username', filter.author]}
              />
            )}

            {filter.favorited && (
              <CommonArticlesList
                model={model}
                queryKey={['username', filter.favorited, 'favorited']}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

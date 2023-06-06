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

  /**
   * Not sure that's the best way but the main point is init store with
   * default falues that we can take from prop and react-router params.
   * It works for now, have to check that later. sorry =)
   */
  useLayoutEffect(() => {
    model.getState().setFilter({
      ...(!favorites && { author: username }),
      ...(favorites && { favorited: username }),
    });

    return () => model.getState().resetFilter(initialFilterState);
  }, [favorites, model, username]);

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

            <CommonArticlesList model={model} />
          </div>
        </div>
      </div>
    </div>
  );
}

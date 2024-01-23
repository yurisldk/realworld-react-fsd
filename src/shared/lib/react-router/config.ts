import { SlugPageParams, UsernamePageParams } from './react-router.types';

export const pathKeys = {
  root: '/',
  login() {
    return pathKeys.root.concat('login/');
  },
  register() {
    return pathKeys.root.concat('register/');
  },
  settings() {
    return pathKeys.root.concat('settings/');
  },
  home() {
    return pathKeys.root;
  },
  page404() {
    return pathKeys.root.concat('404/');
  },
  article: {
    root() {
      return pathKeys.root.concat('article/');
    },
    bySlug({ slug }: SlugPageParams) {
      return pathKeys.article.root().concat(slug, '/');
    },
  },
  profile: {
    root() {
      return pathKeys.root.concat('profile/');
    },
    byUsername({ username }: UsernamePageParams) {
      return pathKeys.profile.root().concat(username, '/');
    },
    byUsernameFavorites({ username }: UsernamePageParams) {
      return pathKeys.profile.byUsername({ username }).concat('favorites/');
    },
  },
  editor: {
    root() {
      return pathKeys.root.concat('editor/');
    },
    bySlug({ slug }: SlugPageParams) {
      return pathKeys.editor.root().concat(slug, '/');
    },
  },
};

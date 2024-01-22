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
    bySlug(slug: string) {
      return pathKeys.article.root().concat(slug, '/');
    },
  },
  profile: {
    root() {
      return pathKeys.root.concat('profile/');
    },
    byUsername(username: string) {
      return pathKeys.profile.root().concat(username, '/');
    },
    byUsernameFavorites(username: string) {
      return pathKeys.profile.byUsername(username).concat('favorites/');
    },
  },
  editor: {
    root() {
      return pathKeys.root.concat('editor/');
    },
    bySlug(slug: string) {
      return pathKeys.editor.root().concat(slug, '/');
    },
  },
};

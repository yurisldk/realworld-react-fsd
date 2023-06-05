export const PATH_PAGE = {
  root: '/',
  login: '/login',
  register: '/register',
  settings: '/settings',
  profile: {
    root: (username: string) => `/profile/${username}`,
    favorites: (username: string) => `/profile/${username}/favorites`,
  },
  editor: {
    root: '/editor',
    edit: (slug: string) => `/editor/${slug}`,
  },
  article: {
    slug: (slug: string) => `article/${slug}`,
  },
  page404: '/404',
};

export const PATH_PAGE = {
  root: '/',
  login: '/login',
  register: '/register',
  settings: '/settings',
  profile: {
    root: (username: string) => `/profile/${username}`,
    favorites: (username: string) => `/profile/${username}/favorites`,
  },
  page404: '/404',
};

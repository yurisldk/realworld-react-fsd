export const profilePaths = {
  followToggle: 'follow-toggle',
  favoriteToggle: 'articles/:slug/favorite-toggle',
  getFollowTogglePath: (username: string) => `/profile/${username}/follow-toggle`,
  getFavoriteTogglePath: (username: string, slug: string) => `/profile/${username}/articles/${slug}/favorite-toggle`,
};

export const articlePaths = {
  delete: 'delete',
  followToggle: 'follow-toggle',
  favoriteToggle: 'favorite-toggle',
  comments: 'comments',
  comment: 'comments/:id',
  getDeletePath: (slug: string) => `/article/${slug}/delete`,
  getFollowTogglePath: (slug: string) => `/article/${slug}/follow-toggle`,
  getFavoriteTogglePath: (slug: string) => `/article/${slug}/favorite-toggle`,
  getCommentsPath: (slug: string) => `/article/${slug}/comments`,
  getCommentPath: (slug: string, id: number) => `/article/${slug}/comments/${id}`,
};

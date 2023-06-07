import { useQuery } from '@tanstack/react-query';
import {
  CommentDto,
  GenericErrorModel,
  RequestParams,
  realworldApi,
} from '~shared/api/realworld';

export const commentKeys = {
  comments: {
    root: ['comments'],
    slug: (slug: string) => [...commentKeys.comments.root, slug],
  },
};

export const useCommentsQuery = (slug: string, params?: RequestParams) =>
  useQuery<CommentDto[], GenericErrorModel, CommentDto[], string[]>({
    queryKey: commentKeys.comments.slug(slug),

    queryFn: async ({ signal }) => {
      const response = await realworldApi.articles.getArticleComments(slug, {
        signal,
        ...params,
      });

      return response.data.comments;
    },
  });

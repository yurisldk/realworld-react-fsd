import { useQuery } from '@tanstack/react-query';
// FIXME: add no-restricted-imports exceptions for ~entities/*/@x/**
// eslint-disable-next-line no-restricted-imports
import { ProfileDto, mapProfile } from '~entities/profile/@x/comment';
import {
  CommentDto,
  GenericErrorModel,
  RequestParams,
  realworldApi,
} from '~shared/api/realworld';

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: ProfileDto;
}

export function mapComment(commentDto: CommentDto): Comment {
  const { author, ...comment } = commentDto;
  return {
    ...comment,
    author: mapProfile(author),
  };
}

export const commentKeys = {
  comments: {
    root: ['comments'],
    slug: (slug: string) => [...commentKeys.comments.root, slug],
  },
};

export const useCommentsQuery = (slug: string, params?: RequestParams) =>
  useQuery<Comment[], GenericErrorModel, Comment[], string[]>({
    queryKey: commentKeys.comments.slug(slug),

    queryFn: async ({ signal }) => {
      const response = await realworldApi.articles.getArticleComments(slug, {
        signal,
        ...params,
      });

      return response.data.comments.map(mapComment);
    },
  });

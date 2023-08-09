import { useMutation } from '@tanstack/react-query';
import { articleApi } from '~entities/article';
import { GenericErrorModel, realworldApi } from '~shared/api/realworld';

export const useDeleteArticle = () =>
  useMutation<any, GenericErrorModel, string, unknown>({
    mutationKey: articleApi.articleKeys.mutation.delete(),
    mutationFn: async (slug: string) => {
      const response = await realworldApi.articles.deleteArticle(slug);
      return response.data;
    },
  });

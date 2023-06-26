import { useMutation } from '@tanstack/react-query';
import { GenericErrorModel, realworldApi } from '~shared/api/realworld';

export const useDeleteArticle = () =>
  useMutation<any, GenericErrorModel, string, unknown>(async (slug: string) => {
    const response = await realworldApi.articles.deleteArticle(slug);
    return response.data;
  });

import { useMutation } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';

export const useDeleteArticle = () =>
  useMutation(async (slug: string) =>
    realworldApi.articles.deleteArticle(slug),
  );

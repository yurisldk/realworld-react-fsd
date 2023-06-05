import { useMutation } from '@tanstack/react-query';
import { NewArticleDto, realworldApi } from '~shared/api/realworld';

export const useCreateArticle = () =>
  useMutation(async (article: NewArticleDto) => {
    const response = await realworldApi.articles.createArticle({
      article,
    });

    return response.data.article;
  });

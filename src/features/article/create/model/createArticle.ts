import { useMutation } from '@tanstack/react-query';
import {
  ArticleDto,
  GenericErrorModel,
  NewArticleDto,
  realworldApi,
} from '~shared/api/realworld';

export const useCreateArticle = () =>
  useMutation<ArticleDto, GenericErrorModel, NewArticleDto, unknown>(
    async (article: NewArticleDto) => {
      const response = await realworldApi.articles.createArticle({
        article,
      });

      return response.data.article;
    },
  );

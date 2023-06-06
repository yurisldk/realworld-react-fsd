import { useMutation } from '@tanstack/react-query';
import {
  ArticleDto,
  GenericErrorModelDto,
  HttpResponse,
  NewArticleDto,
  realworldApi,
} from '~shared/api/realworld';

export const useCreateArticle = () =>
  useMutation<
    ArticleDto,
    HttpResponse<unknown, GenericErrorModelDto>,
    NewArticleDto,
    unknown
  >(async (article: NewArticleDto) => {
    const response = await realworldApi.articles.createArticle({
      article,
    });

    return response.data.article;
  });

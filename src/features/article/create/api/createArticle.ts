import { useMutation } from '@tanstack/react-query';
import { articleApi } from '~entities/article';
import {
  GenericErrorModel,
  NewArticleDto,
  realworldApi,
} from '~shared/api/realworld';

export const useCreateArticle = () =>
  useMutation<articleApi.Article, GenericErrorModel, NewArticleDto, unknown>({
    mutationKey: articleApi.articleKeys.mutation.create(),
    mutationFn: async (article: NewArticleDto) => {
      const response = await realworldApi.articles.createArticle({
        article,
      });

      return articleApi.mapArticle(response.data.article);
    },
  });

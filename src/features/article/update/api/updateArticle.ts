import { useMutation } from '@tanstack/react-query';
import { articleApi } from '~entities/article';
import {
  GenericErrorModel,
  UpdateArticleDto,
  realworldApi,
} from '~shared/api/realworld';

type UpdateArticleProps = {
  slug: string;
  article: UpdateArticleDto;
};

export const useUpdateArticle = () =>
  useMutation<
    articleApi.Article,
    GenericErrorModel,
    UpdateArticleProps,
    unknown
  >({
    mutationKey: articleApi.articleKeys.mutation.update(),
    mutationFn: async ({ slug, article }: UpdateArticleProps) => {
      const response = await realworldApi.articles.updateArticle(slug, {
        article,
      });

      return articleApi.mapArticle(response.data.article);
    },
  });

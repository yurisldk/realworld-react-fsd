import { useMutation } from '@tanstack/react-query';
import {
  ArticleDto,
  GenericErrorModelDto,
  HttpResponse,
  UpdateArticleDto,
  realworldApi,
} from '~shared/api/realworld';

type UpdateArticleProps = {
  slug: string;
  article: UpdateArticleDto;
};

export const useUpdateArticle = () =>
  useMutation<
    ArticleDto,
    HttpResponse<unknown, GenericErrorModelDto>,
    UpdateArticleProps,
    unknown
  >(async ({ slug, article }: UpdateArticleProps) => {
    const response = await realworldApi.articles.updateArticle(slug, {
      article,
    });

    return response.data.article;
  });

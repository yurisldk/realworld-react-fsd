import { Suspense } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { articleQueryOptions } from '~entities/article/article.api';
import { UpdateArticleSchema } from './update-article.contract';
import { transformArticleToUpdateArticle } from './update-article.lib';
import { useUpdateArticleMutation } from './update-article.mutation';
import { UpdateArticleSkeleton } from './update-article.skeleton';
import { UpdateArticle } from './update-article.types';

type UpdateArticleFormProps = {
  slug: string;
};

export function UpdateArticleForm(props: UpdateArticleFormProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<UpdateArticleSkeleton />}>
        <BaseUpdateArticleForm {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseUpdateArticleForm(props: UpdateArticleFormProps) {
  const { slug } = props;

  const navigate = useNavigate();

  const { data: article } = useSuspenseQuery(articleQueryOptions(slug));

  const { mutate, isPending, isError, error } = useUpdateArticleMutation({
    mutationKey: [slug],
    onSuccess: (updatedArticle) => {
      navigate(pathKeys.article.bySlug(updatedArticle.slug), { replace: true });
    },
  });

  const mutationErrors = error?.response?.data || [error?.message];

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdateArticle>({
    mode: 'onTouched',
    resolver: zodResolver(UpdateArticleSchema),
    defaultValues: transformArticleToUpdateArticle(article),
  });

  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (updateArticle: UpdateArticle) => {
    mutate(updateArticle);
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      {isError && (
        <ul className="error-messages" data-test="article-error">
          {mutationErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <fieldset className="form-group">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Article Title"
          disabled={isPending}
          data-test="article-title-input"
          {...register('title')}
        />
        <ErrorMessage errors={errors} name="title" />
      </fieldset>
      <fieldset className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="What's this article about?"
          disabled={isPending}
          data-test="article-description-input"
          {...register('description')}
        />
        <ErrorMessage errors={errors} name="description" />
      </fieldset>
      <fieldset className="form-group">
        <textarea
          className="form-control"
          rows={8}
          placeholder="Write your article (in markdown)"
          disabled={isPending}
          data-test="article-body-input"
          {...register('body')}
        />
        <ErrorMessage errors={errors} name="body" />
      </fieldset>
      <fieldset className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter tags"
          disabled={isPending}
          data-test="article-tags-input"
          {...register('tagList')}
        />
        <ErrorMessage errors={errors} name="tagList" />
      </fieldset>

      <button
        className="btn btn-lg pull-xs-right btn-primary"
        type="submit"
        disabled={!canSubmit}
        data-test="article-submit"
      >
        Update Article
      </button>
    </form>
  );
}

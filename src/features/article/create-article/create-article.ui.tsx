import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { CreateArticleSchema } from './create-article.contract';
import { useCreateArticleMutation } from './create-article.mutation';
import { CreateArticle } from './create-article.types';

export function CreateArticleForm() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <BaseCreateArticleForm />
    </ErrorBoundary>
  );
}

export function BaseCreateArticleForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateArticle>({
    mode: 'onTouched',
    resolver: zodResolver(CreateArticleSchema),
    defaultValues: { title: '', description: '', body: '', tagList: '' },
  });

  const { mutate, isPending, isError, error } = useCreateArticleMutation({
    onSuccess: (article) => {
      navigate(pathKeys.article.bySlug(article.slug), { replace: true });
    },
  });

  const mutationErrors = error?.response?.data || [error?.message];
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (createArticle: CreateArticle) => {
    mutate(createArticle);
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
        <ErrorMessage errors={errors} name="title" as="div" role="alert" />
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
        <ErrorMessage errors={errors} name="description" as="div" role="alert" />
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
        <ErrorMessage errors={errors} name="body" as="div" role="alert" />
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
        <ErrorMessage errors={errors} name="tagList" as="div" role="alert" />
      </fieldset>

      <button
        className="btn btn-lg pull-xs-right btn-primary"
        type="submit"
        disabled={!canSubmit}
        data-test="article-submit"
      >
        Publish Article
      </button>
    </form>
  );
}

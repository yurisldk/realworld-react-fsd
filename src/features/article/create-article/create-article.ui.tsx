import { zodResolver } from '@hookform/resolvers/zod'
import { withErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { compose } from '~shared/lib/react'
import { hasMessages } from '~shared/lib/react-hook-form'
import { pathKeys } from '~shared/lib/react-router'
import { useSessionStore } from '~shared/session'
import { ErrorHandler, logError } from '~shared/ui/error-handler'
import { ErrorList } from '~shared/ui/error-list'
import { spinnerModel } from '~shared/ui/spinner'
import { CreateArticleSchema, CreateArticle } from './create-article.contract'
import { transformCreateArticleToArticle } from './create-article.lib'
import { useCreateArticleMutation } from './create-article.mutation'

const enhance = compose((component) =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

export const CreateArticleForm = enhance(() => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateArticle>({
    mode: 'onTouched',
    resolver: zodResolver(CreateArticleSchema),
    defaultValues: { title: '', description: '', body: '', tagList: '' },
  })

  const { mutate, isPending } = useCreateArticleMutation({
    onMutate: () => {
      spinnerModel.globalSpinner.getState().show()
    },

    onSuccess: (response) => {
      const { slug } = response.data.article
      navigate(pathKeys.article.bySlug({ slug }), { replace: true })
    },

    onError: (error) => {
      setError('root', { message: error.message })
    },

    onSettled: () => {
      spinnerModel.globalSpinner.getState().hide()
    },
  })

  const canSubmit = [isDirty, isValid, !isPending].every(Boolean)

  const onSubmit = (createArticle: CreateArticle) => {
    const { session } = useSessionStore.getState()

    if (!session)
      throw new Error('Session does not exist. Please log in and try again.')

    const article = transformCreateArticleToArticle({ createArticle, session })
    mutate(article)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {hasMessages(errors) && <ErrorList errors={errors} />}

      <fieldset className="form-group">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Article Title"
          disabled={isPending}
          {...register('title')}
        />
      </fieldset>

      <fieldset className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="What's this article about?"
          disabled={isPending}
          {...register('description')}
        />
      </fieldset>

      <fieldset className="form-group">
        <textarea
          className="form-control"
          rows={8}
          placeholder="Write your article (in markdown)"
          disabled={isPending}
          {...register('body')}
        />
      </fieldset>

      <fieldset className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter tags"
          disabled={isPending}
          {...register('tagList')}
        />
      </fieldset>

      <button
        className="btn btn-lg pull-xs-right btn-primary"
        type="submit"
        disabled={!canSubmit}
      >
        Publish Article
      </button>
    </form>
  )
})

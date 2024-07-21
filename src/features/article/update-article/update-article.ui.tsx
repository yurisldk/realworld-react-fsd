import { useLayoutEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { withErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import { useLocation, Location, useNavigate } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { hasMessages } from '~shared/lib/react-hook-form'
import { pathKeys } from '~shared/lib/react-router'
import { ErrorHandler, logError } from '~shared/ui/error-handler'
import { ErrorList } from '~shared/ui/error-list'
import { spinnerModel } from '~shared/ui/spinner'
import { ArticleQueries } from '~entities/article'
import { UpdateArticleSchema, UpdateArticle } from './update-article.contract'
import { transformArticleToUpdateArticle } from './update-article.lib'
import { useUpdateArticleMutation } from './update-article.mutation'
import { UpdateArticleSkeleton } from './update-article.skeleton'

type UpdateArticleFormProps = {
  slug: string
}

const enhance = compose<UpdateArticleFormProps>(
  (component) =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
  (component) =>
    withSuspense(component, { FallbackComponent: UpdateArticleSkeleton }),
)

export const UpdateArticleForm = enhance((props: UpdateArticleFormProps) => {
  const { slug } = props

  const navigate = useNavigate()

  const { state } =
    useLocation() as Location<InitializeUpdateArticleFormState | null>

  const { data: currentArticle } = useSuspenseQuery(
    ArticleQueries.articleQuery(slug),
  )

  const { mutate, isPending } = useUpdateArticleMutation({
    mutationKey: [slug],

    onMutate: (updatedArticle) => {
      spinnerModel.globalSpinner.getState().show()
      navigate(pathKeys.article.bySlug({ slug: updatedArticle.slug }))
    },

    onError: (error, updatedArticle) => {
      navigate(pathKeys.editor.root(), {
        state: { error, updatedArticle },
        replace: true,
      })
    },

    onSettled: () => {
      spinnerModel.globalSpinner.getState().hide()
    },
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdateArticle>({
    mode: 'onTouched',
    resolver: zodResolver(UpdateArticleSchema),
    // TODO: add ...state?.updatedArticle
    defaultValues: transformArticleToUpdateArticle(currentArticle),
  })

  const canSubmit = [isDirty, isValid, !isPending].every(Boolean)

  const onSubmit = (updateArticle: UpdateArticle) => {
    mutate({
      ...currentArticle,
      ...updateArticle,
      // TODO: merge currentArticle.tagList with updateArticle.tagList
      tagList: updateArticle.tagList?.split(', ') || [],
    })
  }

  useLayoutEffect(() => {
    if (!state) return
    setError('root', { message: state.error.message })
    window.history.replaceState({}, '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {hasMessages(errors) && <ErrorList errors={errors} />}

      <fieldset className="form-group">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Article Title"
          {...register('title')}
        />
      </fieldset>
      <fieldset className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="What's this article about?"
          {...register('description')}
        />
      </fieldset>
      <fieldset className="form-group">
        <textarea
          className="form-control"
          rows={8}
          placeholder="Write your article (in markdown)"
          {...register('body')}
        />
      </fieldset>
      <fieldset className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter tags"
          {...register('tagList')}
        />
      </fieldset>

      <button
        className="btn btn-lg pull-xs-right btn-primary"
        type="submit"
        disabled={!canSubmit}
      >
        Update Article
      </button>
    </form>
  )
})

type InitializeUpdateArticleFormState = {
  error: Error
  updateArticle: UpdateArticle
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { withErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authContractsDto, authTypesDto } from '~shared/api/auth'
import { compose, withSuspense } from '~shared/lib/react'
import { hasMessages } from '~shared/lib/react-hook-form'
import { pathKeys } from '~shared/lib/react-router'
import { SessionQueries } from '~shared/session'
import { ErrorHandler, logError } from '~shared/ui/error-handler'
import { ErrorList } from '~shared/ui/error-list'
import { spinnerModel } from '~shared/ui/spinner'
import { useUpdateSessionMutation } from './update-session.mutation'
import { UpdateSessionFormSkeleton } from './update-session.skeleton'

const enhance = compose(
  (component) =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
  (component) =>
    withSuspense(component, { FallbackComponent: UpdateSessionFormSkeleton }),
)

export const UpdateSessionForm = enhance(() => {
  const navigate = useNavigate()

  const { data: user } = useSuspenseQuery(SessionQueries.currentSessionQuery())

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<authTypesDto.UpdateUserDto>({
    mode: 'onTouched',
    resolver: zodResolver(authContractsDto.UpdateUserDtoSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      image: user.image,
      password: '',
    },
  })

  const { mutate, isPending } = useUpdateSessionMutation({
    mutationKey: [user],

    onMutate: async () => {
      spinnerModel.globalSpinner.getState().show()
    },

    onSuccess: (response) => {
      const { username } = response.data.user
      navigate(pathKeys.profile.byUsername({ username }), { replace: true })
    },

    onError: (error) => {
      setError('root', { message: error.message })
    },

    onSettled: () => {
      spinnerModel.globalSpinner.getState().hide()
    },
  })

  const canSubmit = [isDirty, isValid, !isPending].every(Boolean)

  const onSubmit = (updateUserDto: authTypesDto.UpdateUserDto) =>
    mutate(updateUserDto)

  return (
    <>
      {hasMessages(errors) && <ErrorList errors={errors} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <fieldset
            className="form-group"
            disabled={isPending}
          >
            <input
              className="form-control"
              type="text"
              placeholder="URL of profile picture"
              {...register('image')}
            />
          </fieldset>
          <fieldset
            className="form-group"
            disabled={isPending}
          >
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Your Name"
              {...register('username')}
            />
          </fieldset>
          <fieldset
            className="form-group"
            disabled={isPending}
          >
            <textarea
              className="form-control form-control-lg"
              rows={8}
              placeholder="Short bio about you"
              {...register('bio')}
            />
          </fieldset>
          <fieldset
            className="form-group"
            disabled={isPending}
          >
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Email"
              {...register('email')}
            />
          </fieldset>
          <fieldset
            className="form-group"
            disabled={isPending}
          >
            <input
              {...register('password')}
              className="form-control form-control-lg"
              type="password"
              placeholder="Password"
            />
          </fieldset>

          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={!canSubmit}
          >
            Update Settings
          </button>
        </fieldset>
      </form>
    </>
  )
})

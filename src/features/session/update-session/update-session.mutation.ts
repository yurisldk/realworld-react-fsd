import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { AuthService, authTypesDto } from '~shared/api/auth'
import { queryClient } from '~shared/lib/react-query'
import { SessionQueries } from '~shared/session'
import { ProfileQueries } from '~entities/profile'

export function useUpdateSessionMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.updateUserMutation>>,
      DefaultError,
      authTypesDto.UpdateUserDto,
      unknown
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >,
) {
  const {
    mutationKey = [],
    onMutate,
    onSuccess,
    onError,
    onSettled,
  } = options || {}

  return useMutation({
    mutationKey: ['session', 'update-session', ...mutationKey],

    mutationFn: (updateUserDto: authTypesDto.UpdateUserDto) =>
      AuthService.updateUserMutation({ user: updateUserDto }),

    onMutate: async (updateUserDto) => {
      await queryClient.cancelQueries({
        queryKey: SessionQueries.currentSessionQuery().queryKey,
      })

      const prevUser = queryClient.getQueryData(
        SessionQueries.currentSessionQuery().queryKey,
      )

      const updateUser = prevUser && { ...prevUser, ...updateUserDto }

      const prevProfile =
        updateUser &&
        queryClient.getQueryData(
          ProfileQueries.profileQuery(updateUser.username).queryKey,
        )

      queryClient.setQueryData(
        SessionQueries.currentSessionQuery().queryKey,
        updateUser,
      )

      if (updateUser) {
        queryClient.setQueryData(
          ProfileQueries.profileQuery(updateUser.username).queryKey,
          prevProfile,
        )
      }

      await onMutate?.(updateUserDto)

      return { prevUser, prevProfile }
    },

    onSuccess,

    onError: async (error, updateUserDto, context) => {
      const { prevUser, prevProfile } = context || {}

      queryClient.setQueryData(
        SessionQueries.currentSessionQuery().queryKey,
        prevUser,
      )

      if (prevProfile) {
        queryClient.setQueryData(
          ProfileQueries.profileQuery(prevProfile.username).queryKey,
          prevProfile,
        )
      }

      await onError?.(error, updateUserDto, context)
    },

    onSettled: async (data, error, updateUserDto, context) => {
      const { prevProfile } = context || {}

      await queryClient.invalidateQueries({
        queryKey: SessionQueries.currentSessionQuery().queryKey,
      })

      if (prevProfile) {
        await queryClient.invalidateQueries({
          queryKey: ProfileQueries.profileQuery(prevProfile.username).queryKey,
        })
      }

      await onSettled?.(data, error, updateUserDto, context)
    },
  })
}

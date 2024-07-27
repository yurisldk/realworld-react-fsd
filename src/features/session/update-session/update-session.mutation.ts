import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { AuthService, authTypesDto } from '~shared/api/auth'
import { queryClient } from '~shared/lib/react-query'
import { sessionLib, SessionQueries } from '~shared/session'
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
      AuthService.updateUserMutation({ updateUserDto }),

    onMutate: async (updateUserDto) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: SessionQueries.currentSessionQuery().queryKey,
        }),
        onMutate?.(updateUserDto),
      ])
    },

    onSuccess: async (response, variables, context) => {
      const session = sessionLib.transformUserDtoToSession(response.data)
      const { token, ...profile } = session

      queryClient.setQueryData(
        SessionQueries.currentSessionQuery().queryKey,
        session,
      )

      queryClient.setQueryData(
        ProfileQueries.profileQuery(session.username).queryKey,
        { ...profile, following: false },
      )

      await onSuccess?.(response, variables, context)
    },

    onError,

    onSettled,
  })
}

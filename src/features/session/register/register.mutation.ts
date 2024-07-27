import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { AuthService, authTypesDto } from '~shared/api/auth'
import { sessionLib, useSessionStore } from '~shared/session'

export function useRegisterMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.createUserMutation>>,
      DefaultError,
      authTypesDto.CreateUserDto,
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
    mutationKey: ['session', 'register-user', ...mutationKey],

    mutationFn: async (createUserDto: authTypesDto.CreateUserDto) =>
      AuthService.createUserMutation({ createUserDto }),

    onMutate,

    onSuccess: async (response, variables, context) => {
      const { user } = response.data
      const { setSession } = useSessionStore.getState()

      const session = sessionLib.transformUserDtoToSession({ user })
      setSession(session)

      await onSuccess?.(response, variables, context)
    },

    onError,

    onSettled,
  })
}

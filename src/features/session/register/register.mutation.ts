import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { AuthService, authTypesDto } from '~shared/api/auth'

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
      AuthService.createUserMutation({ user: createUserDto }),

    onMutate,

    onSuccess,

    onError,

    onSettled,
  })
}

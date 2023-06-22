import { QueryClient } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';
import { useMutateFollowUser } from '../../base/api/baseModel';

export const useMutationFollowUser = (queryClient: QueryClient) =>
  useMutateFollowUser(realworldApi.profiles.followUserByUsername, queryClient);

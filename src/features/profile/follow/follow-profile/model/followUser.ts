import { QueryClient } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';
import { useMutateFollowUser } from '../../base/model/baseModel';

export const useMutationFollowUser = (
  queryKey: unknown[],
  queryClient: QueryClient,
) =>
  useMutateFollowUser(
    queryKey,
    realworldApi.profiles.followUserByUsername,
    queryClient,
  );

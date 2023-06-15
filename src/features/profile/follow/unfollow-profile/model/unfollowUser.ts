import { QueryClient } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';
import { useMutateFollowUser } from '../../base/model/baseModel';

export const useMutationUnfollowUser = (queryClient: QueryClient) =>
  useMutateFollowUser(
    realworldApi.profiles.unfollowUserByUsername,
    queryClient,
  );

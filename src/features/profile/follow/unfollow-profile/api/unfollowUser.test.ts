import { QueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { profileApi } from '~entities/profile';
import { wait } from '~shared/api/msw';
import { realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { setupDeleteUnfollowUserHandlers } from './msw/deleteUnfollowUserHandlers';
import { useMutationUnfollowUser } from './unfollowUser';

const newProfile: profileApi.Profile = {
  username: 'Anah Benešová',
  bio: 'I work at statefarm',
  image: 'https://api.realworld.io/images/demo-avatar.png',
  following: false,
};

const rolledBackProfile: profileApi.Profile = {
  ...newProfile,
  following: true,
};

const queryKey = profileApi.profileKeys.profile.username(newProfile.username);

type Params = Parameters<typeof realworldApi.profiles.unfollowUserByUsername>;
type Return = ReturnType<typeof realworldApi.profiles.unfollowUserByUsername>;

const mockedUnfollowUserByUsername = vi
  .fn<Params, Return>()
  .mockImplementation(realworldApi.profiles.unfollowUserByUsername);

const unfollowUserByUsername = vi
  .spyOn(realworldApi.profiles, 'unfollowUserByUsername')
  .mockImplementation(
    (...args: Params): Return =>
      mockedUnfollowUserByUsername(...args).then((value) => wait(1000, value)),
  );

describe('useMutationUnfollowUser', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.useFakeTimers();
    setupDeleteUnfollowUserHandlers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update a profile successfully', async () => {
    const { result } = renderHook(() => useMutationUnfollowUser(queryClient), {
      wrapper: createWrapper(),
    });

    const createUnfollowProfilePromise = result.current.mutateAsync(newProfile);

    await act(async () => vi.advanceTimersToNextTimerAsync());

    const cachedData = queryClient.getQueryData(queryKey);
    expect(cachedData).toEqual(newProfile);

    await act(async () => vi.runAllTimersAsync());

    await expect(createUnfollowProfilePromise).resolves.toBeDefined();
    expect(result.current.isSuccess).toBe(true);
    expect(unfollowUserByUsername).toBeCalledTimes(1);
    expect(unfollowUserByUsername).toHaveBeenCalledWith(newProfile.username);
    expect(result.current.data).toStrictEqual(newProfile);
  });

  it('should rollback profile on mutation error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useMutationUnfollowUser(queryClient),
      { wrapper: createWrapper() },
    );

    const createUnfollowProfilePromise = result.current.mutateAsync(newProfile);
    await expect(createUnfollowProfilePromise).rejects.toBeDefined();
    rerender();

    const cachedData = queryClient.getQueryData(queryKey);
    expect(unfollowUserByUsername).toHaveBeenCalledWith(newProfile.username);
    expect(cachedData).toEqual(rolledBackProfile);
    expect(result.current.error).toBeDefined();
  });

  it('should handle auth(401) error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useMutationUnfollowUser(queryClient),
      { wrapper: createWrapper() },
    );

    const createUnfollowProfilePromise = result.current.mutateAsync(newProfile);
    await expect(createUnfollowProfilePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'missing authorization credentials',
    });
  });

  it('should handle not found(404) error', async () => {
    const { result, rerender } = renderHook(
      () => useMutationUnfollowUser(queryClient),
      { wrapper: createWrapper() },
    );

    const createUnfollowProfilePromise = result.current.mutateAsync({
      ...newProfile,
      username: 'invalid-username',
    });
    await expect(createUnfollowProfilePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      errors: { profile: ['not found'] },
    });
  });
});

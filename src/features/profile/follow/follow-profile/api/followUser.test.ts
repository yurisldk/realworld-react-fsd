import { QueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { profileApi } from '~entities/profile';
import { wait } from '~shared/api/msw';
import { realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { useMutationFollowUser } from './followUser';
import { setupPostFollowUserHandlers } from './msw/postFollowUserHandlers';

const newProfile: profileApi.Profile = {
  username: 'John Doe',
  bio: 'I work at statefarm',
  image: 'https://api.realworld.io/images/demo-avatar.png',
  following: true,
};

const rolledBackProfile: profileApi.Profile = {
  ...newProfile,
  following: false,
};

const queryKey = profileApi.profileKeys.profile.username(newProfile.username);

type Params = Parameters<typeof realworldApi.profiles.followUserByUsername>;
type Return = ReturnType<typeof realworldApi.profiles.followUserByUsername>;

const mockedFollowUserByUsername = vi
  .fn<Params, Return>()
  .mockImplementation(realworldApi.profiles.followUserByUsername);

const followUserByUsername = vi
  .spyOn(realworldApi.profiles, 'followUserByUsername')
  .mockImplementation(
    (...args: Params): Return =>
      mockedFollowUserByUsername(...args).then((value) => wait(1000, value)),
  );

describe('useMutationFollowUser', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.useFakeTimers();
    setupPostFollowUserHandlers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update a profile successfully', async () => {
    const { result } = renderHook(() => useMutationFollowUser(queryClient), {
      wrapper: createWrapper(),
    });

    const createFollowProfilePromise = result.current.mutateAsync(newProfile);

    await act(async () => vi.advanceTimersToNextTimerAsync());

    const cachedData = queryClient.getQueryData(queryKey);
    expect(cachedData).toEqual(newProfile);

    await act(async () => vi.runAllTimersAsync());

    await expect(createFollowProfilePromise).resolves.toBeDefined();
    expect(result.current.isSuccess).toBe(true);
    expect(followUserByUsername).toBeCalledTimes(1);
    expect(followUserByUsername).toHaveBeenCalledWith(newProfile.username);
    expect(result.current.data).toStrictEqual(newProfile);
  });

  it('should rollback profile on mutation error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useMutationFollowUser(queryClient),
      { wrapper: createWrapper() },
    );

    const createFollowProfilePromise = result.current.mutateAsync(newProfile);
    await expect(createFollowProfilePromise).rejects.toBeDefined();
    rerender();

    const cachedData = queryClient.getQueryData(queryKey);
    expect(followUserByUsername).toHaveBeenCalledWith(newProfile.username);
    expect(cachedData).toEqual(rolledBackProfile);
    expect(result.current.error).toBeDefined();
  });

  it('should handle auth(401) error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useMutationFollowUser(queryClient),
      { wrapper: createWrapper() },
    );

    const createFollowProfilePromise = result.current.mutateAsync(newProfile);
    await expect(createFollowProfilePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'missing authorization credentials',
    });
  });

  it('should handle not found(404) error', async () => {
    const { result, rerender } = renderHook(
      () => useMutationFollowUser(queryClient),
      { wrapper: createWrapper() },
    );

    const createFollowProfilePromise = result.current.mutateAsync({
      ...newProfile,
      username: 'invalid-username',
    });
    await expect(createFollowProfilePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      errors: { profile: ['not found'] },
    });
  });
});

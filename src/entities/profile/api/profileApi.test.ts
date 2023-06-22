import { renderHook, waitFor } from '@testing-library/react';
import { realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { setupGetProfileByUsernameHandlers } from './msw/getProfileByUsernameHandlers';
import { useProfile } from './profileApi';

describe('useProfile', () => {
  beforeEach(() => setupGetProfileByUsernameHandlers());

  it('should return data when username was found', async () => {
    const { result } = renderHook(() => useProfile('Jake'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it('should return data with `following: true` for followed profile', async () => {
    realworldApi.setSecurityData('jwt.token');

    const { result } = renderHook(
      () => useProfile('Anah Benešová', { secure: true }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.following).toBe(true);
  });

  it('should return error when username wasn`t found', async () => {
    const { result } = renderHook(() => useProfile('invalidUsername'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

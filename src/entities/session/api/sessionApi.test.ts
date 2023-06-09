/* eslint-disable @typescript-eslint/dot-notation */
import { renderHook, waitFor } from '@testing-library/react';
import { realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { setupGetCurrentUserHandlers } from './msw/getCurrentUserHandlers';
import { useCurrentUser } from './sessionApi';

describe('useCurrentUser', () => {
  beforeEach(() => {
    setupGetCurrentUserHandlers();
    realworldApi.setSecurityData(null);
  });

  it('should error if token wasn`t provided', async () => {
    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it('should error if authorization header without `Token ` prefix', async () => {
    const { result } = renderHook(
      () => useCurrentUser({}, { headers: { authorization: 'jwtToken' } }),
      {
        wrapper: createWrapper(),
      },
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it('should error if authorization header invalid', async () => {
    realworldApi.setSecurityData('invalidToken');

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it('should success with valid token', async () => {
    realworldApi.setSecurityData('jwtToken');

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

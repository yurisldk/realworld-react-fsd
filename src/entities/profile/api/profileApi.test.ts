import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '~shared/lib/react-query';
import { setupGetProfileByUsernameHandlers } from './msw/getProfileByUsernameHandlers';
import { useProfile } from './profileApi';

describe('useArticle', () => {
  beforeEach(() => setupGetProfileByUsernameHandlers());

  it('success', async () => {
    const { result } = renderHook(() => useProfile('jake'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it('error', async () => {
    const { result } = renderHook(() => useProfile('ivalidUsername'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

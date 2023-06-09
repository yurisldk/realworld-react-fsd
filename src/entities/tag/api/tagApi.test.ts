import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '~shared/lib/react-query';
import { setupGetTagsHandlers } from './msw/getTagsHandlers';
import { useGlobalTags } from './tagApi';

describe('useArticle', () => {
  beforeEach(() => setupGetTagsHandlers());

  it('success', async () => {
    const { result } = renderHook(() => useGlobalTags(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

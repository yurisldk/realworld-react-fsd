import { useQuery } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';

export const useGlobalTags = () =>
  useQuery(['tags', 'global'], async ({ signal }) => {
    const response = await realworldApi.tags.getTags({ signal });

    return response.data.tags;
  });

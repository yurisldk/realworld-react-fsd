import { useQuery } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';

export const tagKeys = {
  tags: {
    root: ['tags'],
    global: () => [...tagKeys.tags.root, 'global'],
  },
};

export const useGlobalTags = () =>
  useQuery({
    queryKey: tagKeys.tags.global(),
    queryFn: async ({ signal }) => {
      const response = await realworldApi.tags.getTags({ signal });
      return response.data.tags;
    },
  });

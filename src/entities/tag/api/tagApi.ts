import { useQuery } from '@tanstack/react-query';
import { GenericErrorModel, realworldApi } from '~shared/api/realworld';

export type Tag = string;

function mapTag(tagDto: string): Tag {
  return tagDto;
}

export const tagKeys = {
  tags: {
    root: ['tags'],
    global: () => [...tagKeys.tags.root, 'global'],
  },
};

export const useGlobalTags = () =>
  useQuery<Tag[], GenericErrorModel, Tag[], string[]>({
    queryKey: tagKeys.tags.global(),
    queryFn: async ({ signal }) => {
      const response = await realworldApi.tags.getTags({ signal });
      return response.data.tags.map(mapTag);
    },
  });

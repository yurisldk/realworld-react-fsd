import { baseUrl } from '~shared/api/realworld';
import { createQuery, zodContract } from '~shared/lib/json-query';
import { TagsDtoSchema } from './tag.contracts';
import { mapTags } from './tag.lib';

export const TAGS_KEY = ['tags', 'tags'];
export const tagsQuery = createQuery({
  request: {
    url: baseUrl('/tags'),
    method: 'GET',
  },
  response: {
    contract: zodContract(TagsDtoSchema),
    mapData: ({ result }) => mapTags(result),
  },
});

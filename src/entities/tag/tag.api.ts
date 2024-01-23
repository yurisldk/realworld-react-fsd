import { baseUrl } from '~shared/api/realworld';
import { createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { TagsDtoSchema } from './tag.contracts';
import { mapTags } from './tag.lib';

export async function tagsQuery(signal?: AbortSignal) {
  return createJsonQuery({
    request: {
      url: baseUrl('/tags'),
      method: 'GET',
    },
    response: {
      contract: zodContract(TagsDtoSchema),
      mapData: mapTags,
    },
    abort: signal,
  });
}

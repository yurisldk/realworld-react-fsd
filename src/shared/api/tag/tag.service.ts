import { createJsonQuery } from '../../lib/fetch'
import { getUrl } from '../api.service'
import { TagsDtoSchema } from './tag.contracts'

export class TagService {
  static tagsQuery(signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: getUrl('/tags'),
        method: 'GET',
      },
      response: { contract: TagsDtoSchema },
      abort: signal,
    })
  }
}

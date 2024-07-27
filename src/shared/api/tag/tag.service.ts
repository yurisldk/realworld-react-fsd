import { AxiosContracts } from '../../lib/axios'
import { realworld } from '../index'
import { TagsDtoSchema } from './tag.contracts'

export class TagService {
  static tagsQuery(config: { signal?: AbortSignal }) {
    return realworld
      .get('/tags', config)
      .then(AxiosContracts.responseContract(TagsDtoSchema))
  }
}

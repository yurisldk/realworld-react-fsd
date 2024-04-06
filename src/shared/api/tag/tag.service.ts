import { createJsonQuery } from '../../lib/fetch';
import { zodContract } from '../../lib/zod';
import { IUrlService } from '../url.service';
import { TagsDtoSchema } from './tag.contracts';
import { TagsDto } from './tag.types';

export interface ITagService {
  tagsQuery(signal?: AbortSignal): Promise<TagsDto>;
}

export class TagService implements ITagService {
  constructor(private readonly urlService: IUrlService) {}

  tagsQuery(signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: this.urlService.getUrl('/tags'),
        method: 'GET',
      },
      response: { contract: zodContract(TagsDtoSchema) },
      abort: signal,
    });
  }
}

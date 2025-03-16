import type { TagsDto } from '~shared/api/api.types';
import type { Tags } from './tag.types';

export function transformTagsDtoToTags(tagsDto: TagsDto): Tags {
  return tagsDto.tags;
}

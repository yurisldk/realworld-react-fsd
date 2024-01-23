import { Tag, TagDto, Tags, TagsDto } from './tag.types';

export function mapTag(tagDto: TagDto): Tag {
  return tagDto;
}

export function mapTags(tagsDto: TagsDto): Tags {
  return tagsDto.tags;
}

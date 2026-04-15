import * as zod from 'zod/mini';

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;
const MAX_LIMIT = 100;

const OffsetSchema = zod.coerce.number().check(zod.int(), zod.nonnegative(), zod.lte(Number.MAX_SAFE_INTEGER));
const LimitSchema = zod.coerce.number().check(zod.int(), zod.gte(1), zod.lte(MAX_LIMIT));
const NonEmptyStringSchema = zod.string().check(zod.trim(), zod.minLength(1));

const PaginationSchema = zod.object({
  limit: zod.catch(LimitSchema, DEFAULT_LIMIT),
  offset: zod.catch(OffsetSchema, DEFAULT_OFFSET),
});

const HomeArticleFilterSchema = zod.object({
  feed: zod.catch(zod.optional(zod.literal('personal')), undefined),
  tag: zod.catch(zod.optional(NonEmptyStringSchema), undefined),
});

export type HomeSearchParams = {
  limit: number;
  offset: number;
  feed?: 'personal';
  tag?: string;
};

export function parseHomeSearchParams(searchParams: URLSearchParams): HomeSearchParams {
  const pagination = PaginationSchema.parse({
    limit: searchParams.get('limit'),
    offset: searchParams.get('offset'),
  });

  const filter = HomeArticleFilterSchema.parse({
    feed: searchParams.get('feed') ?? undefined,
    tag: searchParams.get('tag') ?? undefined,
  });

  if (filter.tag) {
    return { ...pagination, tag: filter.tag };
  }

  if (filter.feed) {
    return { ...pagination, feed: filter.feed };
  }

  return pagination;
}

export function toHomeSearch(params: HomeSearchParams) {
  const nextSearchParams = new URLSearchParams();

  nextSearchParams.set('limit', String(params.limit));
  nextSearchParams.set('offset', String(params.offset));

  if (params.feed === 'personal') {
    nextSearchParams.set('feed', 'personal');
  }

  if (params.tag) {
    nextSearchParams.set('tag', params.tag);
  }

  const nextSearch = nextSearchParams.toString();
  return nextSearch ? `?${nextSearch}` : '';
}

type HomeNavigation = {
  isTagActive: boolean;
  isPersonalActive: boolean;
  isGlobalActive: boolean;
  tag: string | null;
};

export function getHomeNavigation(params: HomeSearchParams): HomeNavigation {
  const isTagActive = Boolean(params.tag);
  const isPersonalActive = !isTagActive && params.feed === 'personal';
  const isGlobalActive = !isTagActive && params.feed !== 'personal';

  return {
    isTagActive,
    isPersonalActive,
    isGlobalActive,
    tag: params.tag ?? null,
  };
}

export function getGlobalFeedLink(params: HomeSearchParams) {
  return toHomeSearch({
    ...params,
    offset: 0,
    feed: undefined,
    tag: undefined,
  });
}

export function getPersonalFeedLink(params: HomeSearchParams) {
  return toHomeSearch({
    ...params,
    offset: 0,
    feed: 'personal',
    tag: undefined,
  });
}

export function getTagFeedLink(params: HomeSearchParams, tag: string) {
  return toHomeSearch({
    ...params,
    offset: 0,
    feed: undefined,
    tag,
  });
}

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

const ProfileArticleFilterSchema = zod.object({
  author: zod.catch(zod.optional(NonEmptyStringSchema), undefined),
  favorited: zod.catch(zod.optional(NonEmptyStringSchema), undefined),
});

type ProfileSearchParams = {
  limit: number;
  offset: number;
  author?: string;
  favorited?: string;
};

export function parseProfileSearchParams(searchParams: URLSearchParams, username: string): ProfileSearchParams {
  const pagination = PaginationSchema.parse({
    limit: searchParams.get('limit'),
    offset: searchParams.get('offset'),
  });

  const filter = ProfileArticleFilterSchema.parse({
    author: searchParams.get('author') ?? undefined,
    favorited: searchParams.get('favorited') ?? undefined,
  });

  if (filter.favorited) {
    return { ...pagination, favorited: filter.favorited };
  }

  if (filter.author) {
    return { ...pagination, author: filter.author };
  }

  return { ...pagination, author: username };
}

export function toProfileSearch(params: ProfileSearchParams) {
  const nextSearchParams = new URLSearchParams();

  nextSearchParams.set('limit', String(params.limit));
  nextSearchParams.set('offset', String(params.offset));

  if (params.author) {
    nextSearchParams.set('author', params.author);
  }

  if (params.favorited) {
    nextSearchParams.set('favorited', params.favorited);
  }

  const nextSearch = nextSearchParams.toString();
  return nextSearch ? `?${nextSearch}` : '';
}

type ProfileNavigation = {
  isAuthorFeedActive: boolean;
  isFavoritedFeedActive: boolean;
};

export function getProfileNavigation(params: ProfileSearchParams): ProfileNavigation {
  return {
    isAuthorFeedActive: Boolean(params.author),
    isFavoritedFeedActive: Boolean(params.favorited),
  };
}

export function getProfileArticlesLink(params: ProfileSearchParams, username: string) {
  return toProfileSearch({
    ...params,
    offset: 0,
    author: username,
    favorited: undefined,
  });
}

export function getProfileFavoritedLink(params: ProfileSearchParams, username: string) {
  return toProfileSearch({
    ...params,
    offset: 0,
    author: undefined,
    favorited: username,
  });
}

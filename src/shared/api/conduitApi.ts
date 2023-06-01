const realworldHeaders = new Headers();

export const setToken = (token: string) => {
  realworldHeaders.set('Authorization', `Token ${token}`);
};

export const deleteToken = () => {
  realworldHeaders.delete('Authorization');
};

const fetcher = (input: string, init?: RequestInit): Promise<Response> => {
  const authorization = realworldHeaders.get('Authorization');

  return fetch(`https://api.realworld.io/api/${input}`, {
    ...init,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
      ...(authorization && {
        Authorization: authorization,
      }),
    },
  });
};

export type ArticleDto = {
  slug: Slug;
  title: string;
  description: string;
  body: string;
  tagList: [string];
  createdAt: DateIso;
  updatedAt: DateIso;
  favorited: boolean;
  favoritesCount: number;
  author: ProfileDto;
};

export type ArticlesDto = {
  articles: ArticleDto[];
  articlesCount: number;
};

/**
 * Articles
 */

export type ArticlesGlobalParams = {
  tag?: string;
  author?: string;
  favorited?: string;
  offset?: number;
  limit?: number;
};

type ArticlesUserFeedParams = {
  offset?: number;
  limit?: number;
};

export const Articles = {
  global: async (
    params?: ArticlesGlobalParams,
    signal?: AbortSignal,
  ): Promise<ArticlesDto> => {
    // @ts-expect-error
    const searchParams = new URLSearchParams({
      limit: 10,
      offset: 0,
      ...params,
    });

    const response = await fetcher(`articles?${searchParams}`, { signal });

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },

  userFeed: async (
    params?: ArticlesUserFeedParams,
    signal?: AbortSignal,
  ): Promise<ArticlesDto> => {
    // @ts-expect-error
    const searchParams = new URLSearchParams({
      limit: 10,
      offset: 0,
      ...params,
    });

    const response = await fetcher(`articles/feed?${searchParams}`, { signal });

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },

  article: async (slug: Slug) => {
    const response = await fetcher(`articles/${slug}`);

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },

  favoriteArticle: async (
    slug: Slug,
  ): Promise<Record<'article', ArticleDto>> => {
    const response = await fetcher(`articles/${slug}/favorite`, {
      method: 'POST',
    });

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },

  unfavoriteArticle: async (
    slug: Slug,
  ): Promise<Record<'article', ArticleDto>> => {
    const response = await fetcher(`articles/${slug}/favorite`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },
};

/**
 * Profile
 */
export type ProfileDto = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

export const Profile = {
  profile: async (
    profile: string,
    signal?: AbortSignal,
  ): Promise<Record<'profile', ProfileDto>> => {
    const response = await fetcher(`/profiles/${profile}`, { signal });

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },
};

/**
 * Tags
 */
type TagDto = string;
type TagsDto = {
  tags: TagDto[];
};

export const Tags = {
  global: async (): Promise<TagsDto> => {
    const response = await fetcher('tags');
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  },
};

/**
 * Auth
 */

export type UserDto = {
  user: {
    email: string;
    token: string;
    username: string;
    bio?: string | null;
    image?: string | null;
  };
};

export type LoginData = {
  user: {
    email: string;
    password: string;
  };
};

export type RegisterData = {
  user: {
    username: string;
    email: string;
    password: string;
  };
};

export const Auth = {
  login: async (data: LoginData): Promise<UserDto> => {
    const response = await fetcher('users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },

  register: async (data: RegisterData): Promise<UserDto> => {
    const response = await fetcher('users', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },

  сurrentUser: async (signal?: AbortSignal): Promise<UserDto> => {
    const response = await fetcher('user', { signal });

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },

  updateCurrentUser: async (data: UserDto): Promise<UserDto> => {
    const response = await fetcher('user', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },
};

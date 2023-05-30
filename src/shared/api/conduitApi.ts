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

type ProfileDto = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

type ArticleDto = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: [string];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: ProfileDto;
};

type ArticlesDto = {
  articles: ArticleDto[];
  articlesCount: number;
};

/**
 * Articles
 */

type ArticlesParams = {
  type?: string;
  author?: string;
  favorited?: string;
  offset?: string;
  limit?: string;
};

export const Articles = {
  global: async (params?: ArticlesParams): Promise<ArticlesDto> => {
    const searchParams = new URLSearchParams({
      limit: '10',
      offset: '0',
      ...params,
    });

    const response = await fetcher(`articles?${searchParams}`);

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
    bio: string;
    image: string;
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
  login: async (params: LoginData): Promise<UserDto> => {
    const response = await fetcher('users/login', {
      method: 'POST',
      body: JSON.stringify(params),
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

  сurrentUser: async (): Promise<UserDto> => {
    const response = await fetcher('user');

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  },
};

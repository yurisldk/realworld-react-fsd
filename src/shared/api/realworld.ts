const API = 'https://api.realworld.io/api';

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

type ArticlesParams = {
  type?: string;
  author?: string;
  favorited?: string;
  offset?: string;
  limit?: string;
};

export async function fetchArticles(
  params?: ArticlesParams,
): Promise<ArticlesDto> {
  const searchParams = new URLSearchParams({
    limit: '10',
    offset: '0',
    ...params,
  });

  const response = await fetch(`${API}/articles?${searchParams}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

type TagDto = string;
type TagsDto = {
  tags: TagDto[];
};

export async function fetchTags(): Promise<TagsDto> {
  const response = await fetch(`${API}/tags`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

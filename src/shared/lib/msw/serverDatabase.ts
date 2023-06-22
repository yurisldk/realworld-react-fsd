import { factory, nullable, primaryKey } from '@mswjs/data';
import {
  userConfig,
  profilesConfig,
  commentsConfig,
  tagsConfig,
  articlesConfig,
} from './config';

type DatabaseApiType = ReturnType<typeof getDatabaseAPI>;

export type MaybeUserType = ReturnType<DatabaseApiType['user']['findFirst']>;

export type MaybeProfileType = ReturnType<
  DatabaseApiType['profile']['findFirst']
>;

export type MaybeArticleType = ReturnType<
  DatabaseApiType['article']['findFirst']
>;

export type MaybeCommentType = ReturnType<
  DatabaseApiType['comment']['findFirst']
>;

export type MaybeTagType = ReturnType<DatabaseApiType['tag']['findFirst']>;

function getDatabaseAPI() {
  return factory({
    user: {
      token: primaryKey(String),
      email: String,
      username: String,
      bio: nullable(String),
      image: nullable(String),
    },

    profile: {
      username: primaryKey(String),
      bio: String,
      image: String,
      followedBy: (): string[] => [],
    },

    article: {
      slug: primaryKey(String),
      title: String,
      description: String,
      body: String,
      createdAt: String,
      updatedAt: String,
      tagList: (): string[] => [],
      favoritedBy: (): string[] => [],
      authorId: String,
    },

    comment: {
      id: primaryKey(String),
      createdAt: String,
      updatedAt: String,
      body: String,
      authorId: String,
      articleId: String,
    },

    tag: {
      name: primaryKey(String),
    },
  });
}

function seedDatabase(databaseApi: DatabaseApiType) {
  databaseApi.user.create(userConfig);

  profilesConfig.map((profile) => databaseApi.profile.create(profile));

  articlesConfig.map((article) => databaseApi.article.create(article));

  commentsConfig.map((comment) => databaseApi.comment.create(comment));

  tagsConfig.map((tag) => databaseApi.tag.create(tag));
}

export function initTestDatabase() {
  const databaseApi = getDatabaseAPI();
  seedDatabase(databaseApi);

  return databaseApi;
}

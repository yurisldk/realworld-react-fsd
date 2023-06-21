import { factory, manyOf, nullable, oneOf, primaryKey } from '@mswjs/data';
import articlesConfig from './config/articles.json';
import commentsConfig from './config/comments.json';
import profilesConfig from './config/profiles.json';
import tagsConfig from './config/tags.json';

function getDatabaseAPI() {
  return factory({
    user: {
      token: primaryKey(String),
      email: String,
      username: String,
      bio: nullable(String),
      image: String,
      followsAuthors: manyOf('profile'),
      favoriteArticles: manyOf('article'),
    },

    profile: {
      username: primaryKey(String),
      bio: nullable(String),
      image: String,
    },

    article: {
      slug: primaryKey(String),
      title: String,
      description: String,
      body: String,
      tagList: nullable(manyOf('tag')),
      createdAt: String,
      updatedAt: String,
      favoritesCount: Number,
      author: oneOf('profile'),
      comments: nullable(manyOf('comment')),
    },

    comment: {
      id: primaryKey(Number),
      createdAt: String,
      updatedAt: String,
      body: String,
      author: oneOf('profile'),
    },

    tag: {
      name: primaryKey(String),
      used: Number,
    },
  });
}

function getMultipleRandom(arr: any[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

function seedDatabase(databaseApi: ReturnType<typeof getDatabaseAPI>) {
  // jake is current user
  const [jake, anah] = profilesConfig.map((profile) =>
    databaseApi.profile.create(profile),
  );

  const comments = commentsConfig.map((comment) =>
    databaseApi.comment.create({ ...comment, author: jake }),
  );

  const tags = tagsConfig.map((tag) => databaseApi.tag.create(tag));

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userArticles = articlesConfig.slice(0, 7).map((article, idx) =>
    databaseApi.article.create({
      ...article,
      tagList: getMultipleRandom(tags, tags.length),
      author: jake,
      comments: idx === 0 ? comments : null,
    }),
  );

  const anahArticles = articlesConfig.slice(7).map((article) =>
    databaseApi.article.create({
      ...article,
      tagList: getMultipleRandom(tags, tags.length),
      author: anah,
      comments: null,
    }),
  );

  databaseApi.user.create({
    ...jake,
    email: 'jake@jake.jake',
    token: 'jwt.token',
    favoriteArticles: anahArticles.slice(0, 7),
    followsAuthors: [anah],
  });
}

export function initTestDatabase() {
  const databaseApi = getDatabaseAPI();
  seedDatabase(databaseApi);

  return databaseApi;
}

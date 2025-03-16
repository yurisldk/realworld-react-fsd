import { z } from 'zod';

export const ArticleDtoSchema = z.object({
  article: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    body: z.string(),
    tagList: z.string().array(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    favorited: z.boolean(),
    favoritesCount: z.number(),
    author: z.object({
      username: z.string(),
      bio: z.string().nullable(),
      image: z.string().nullable(),
      following: z.boolean(),
    }),
  }),
});

export const ArticlesDtoSchema = z.object({
  articles: z.array(ArticleDtoSchema.shape.article),
  articlesCount: z.number(),
});

export const FilterQueryDtoSchema = z.object({
  offset: z.number().min(0),
  limit: z.number().min(1),
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
});

export const CreateArticleDtoSchema = z.object({
  article: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    body: z.string().min(1),
    tagList: z.optional(z.string().array()),
  }),
});

export const UpdateArticleDtoSchema = z.object({
  article: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    body: z.string().optional(),
    tagList: z.optional(z.string().array()),
  }),
});

export const CommentDtoSchema = z.object({
  comment: z.object({
    id: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    body: z.string(),
    author: z.object({
      username: z.string(),
      bio: z.nullable(z.string()),
      image: z.string(),
      following: z.boolean(),
    }),
  }),
});

export const CommentsDtoSchema = z.object({
  comments: z.array(CommentDtoSchema.shape.comment),
});

export const CreateCommentDtoSchema = z.object({
  comment: z.object({
    body: z.string().min(1),
  }),
});

export const ProfileDtoSchema = z.object({
  profile: z.object({
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    following: z.boolean(),
  }),
});

export const UserDtoSchema = z.object({
  user: z.object({
    email: z.string(),
    token: z.string(),
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
  }),
});

export const LoginUserDtoSchema = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const RegisterUserDtoSchema = z.object({
  user: z.object({
    username: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const UpdateUserDtoSchema = z.object({
  user: z
    .object({
      email: z.string().email().optional().or(z.literal('')),
      username: z.string().min(5).optional().or(z.literal('')),
      bio: z.string().optional().or(z.literal('')),
      image: z.string().optional().or(z.literal('')),
      password: z.string().min(8).optional().or(z.literal('')),
    })
    .partial()
    .refine((args) => Object.values(args).some(Boolean), {
      path: ['root'],
      message: 'One of the fields must be defined',
    }),
});

export const TagsDtoSchema = z.object({ tags: z.array(z.string()) });

export const ApiErrorDataDtoSchema = z.object({
  errors: z.record(z.string(), z.array(z.string())),
});

export const ApiErrorDataSchema = z.array(z.string());

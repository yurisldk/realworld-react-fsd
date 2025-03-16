import { z } from 'zod';
import { FilterQuerySchema } from '~entities/article/article.contracts';

export const BaseLoaderArgsSchema = z.object({
  request: z.custom<Request>(),
  params: z.object({}),
  context: z.object({ filterQuery: FilterQuerySchema }),
});

const PrimaryFilterQuerySchema = FilterQuerySchema.omit({
  author: true,
  favorited: true,
}).superRefine((query, ctx) => {
  const { source, tag } = query;
  if (source === 'user' && tag) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'bar',
      path: ['tag'],
    });
  }
});

export const PrimaryLoaderArgsSchema = z.object({
  request: z.custom<Request>(),
  params: z.object({}),
  context: z.object({ filterQuery: PrimaryFilterQuerySchema }),
});

const SecondaryFilterQuerySchema = FilterQuerySchema.omit({
  tag: true,
}).superRefine((query, ctx) => {
  const { source, author, favorited } = query;

  if (source !== 'global') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Source must be global.',
      path: ['source'],
    });
  }

  if (author && favorited) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Only one of author or favorited can be specified.',
      path: ['author'],
    });
  }

  if (!author && !favorited) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either author or favorited must be specified.',
      path: ['author'],
    });
  }
});

export const SecondaryLoaderArgsSchema = z
  .object({
    request: z.custom<Request>(),
    params: z.object({ username: z.string() }),
    context: z.object({ filterQuery: SecondaryFilterQuerySchema }),
  })
  .superRefine((args, ctx) => {
    const { params, context } = args;
    const { username } = params;
    const { author, favorited } = context.filterQuery;

    if (author && author !== username) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Author does not match the username.',
        path: ['context', 'filterQuery', 'author'],
      });
    }

    if (favorited && favorited !== username) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Favorited does not match the username.',
        path: ['context', 'filterQuery', 'favorited'],
      });
    }
  });

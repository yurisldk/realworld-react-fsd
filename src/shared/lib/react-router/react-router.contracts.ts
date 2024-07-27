import { z } from 'zod'

export const SlugPageParamsSchema = z.object({ slug: z.string() })
export const UsernamePageParamsSchema = z.object({ username: z.string() })

export const ProfilePageArgsSchema = z.object({
  request: z.custom<Request>(),
  params: UsernamePageParamsSchema,
  context: z.any().optional(),
})

export const EditorPageArgsSchema = z.object({
  request: z.custom<Request>(),
  params: SlugPageParamsSchema,
  context: z.any().optional(),
})

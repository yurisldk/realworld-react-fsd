import { z } from 'zod'
import {
  EditorPageArgsSchema,
  ProfilePageArgsSchema,
  SlugPageParamsSchema,
  UsernamePageParamsSchema,
} from './react-router.contracts'

export type SlugPageParams = z.infer<typeof SlugPageParamsSchema>
export type UsernamePageParams = z.infer<typeof UsernamePageParamsSchema>
export type ProfilePageData = z.infer<typeof ProfilePageArgsSchema>
export type EditorPageData = z.infer<typeof EditorPageArgsSchema>

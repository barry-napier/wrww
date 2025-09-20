import { z } from 'zod'

export const VoteValueSchema = z.union([
  z.literal(-1),
  z.literal(0),
  z.literal(1),
])

export const ContentTypeSchema = z.union([
  z.literal('movie'),
  z.literal('tv'),
  z.literal('all'),
])

export const VoteRequestSchema = z.object({
  content_id: z.number().int().positive(),
  vote_value: VoteValueSchema,
  session_id: z.string().uuid(),
})

export const LeaderboardQuerySchema = z.object({
  type: ContentTypeSchema.optional().default('all'),
  genre_id: z.coerce.number().int().positive().optional(),
  trending: z.coerce.boolean().optional().default(false),
})

export const NextCardQuerySchema = z.object({
  session_id: z.string().uuid(),
  type: ContentTypeSchema.optional().default('all'),
  genre_id: z.coerce.number().int().positive().optional(),
})

export const ContentIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const CategoryQuerySchema = z.object({
  type: ContentTypeSchema.optional().default('all'),
})

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
})

export type VoteValue = z.infer<typeof VoteValueSchema>
export type ContentType = z.infer<typeof ContentTypeSchema>
export type VoteRequest = z.infer<typeof VoteRequestSchema>
export type LeaderboardQuery = z.infer<typeof LeaderboardQuerySchema>
export type NextCardQuery = z.infer<typeof NextCardQuerySchema>
export type ContentIdParam = z.infer<typeof ContentIdParamSchema>
export type CategoryQuery = z.infer<typeof CategoryQuerySchema>
export type Pagination = z.infer<typeof PaginationSchema>
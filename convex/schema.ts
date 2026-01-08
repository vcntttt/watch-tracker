import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  works: defineTable({
    title: v.string(),
    type: v.union(
      v.literal('book'),
      v.literal('movie'),
      v.literal('series'),
      v.literal('anime'),
      v.literal('manga'),
    ),
    status: v.union(
      v.literal('backlog'),
      v.literal('in-progress'),
      v.literal('finished'),
      v.literal('dropped'),
    ),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
    tags: v.array(v.string()),
    notes: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    creator: v.optional(v.string()),
    year: v.optional(v.number()),
    progress: v.optional(
      v.object({
        current: v.number(),
        total: v.number(),
      }),
    ),
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_updatedAt', ['updatedAt'])
    .index('by_status_updatedAt', ['status', 'updatedAt'])
    .index('by_type_updatedAt', ['type', 'updatedAt']),
})

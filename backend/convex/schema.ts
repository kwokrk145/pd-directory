import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(v.number()),
    major: v.optional(v.string()),
    graduationYear: v.optional(v.string()),
  })
    .index("email", ["email"])
    .index("by_role", ["role"]),

  experiences: defineTable({
    userId: v.id("users"),
    title: v.string(),
    organization: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    description: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  members: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    role: v.number(),
  })
    .index("by_identity", ["firstName", "lastName", "role"])
    .index("by_role", ["role"]),
});

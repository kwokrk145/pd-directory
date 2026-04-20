import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.number(),
    major: v.optional(v.string()),
    graduationYear: v.optional(v.string()),
  })
    .index("by_email", ["email"])
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
  }).index("by_identity", ["firstName", "lastName", "role"]),
});

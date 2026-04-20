import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const createRegisteredUser = internalMutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.number(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      throw new ConvexError("User already exists");
    }

    const existingRole = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .unique();

    if (existingRole) {
      throw new ConvexError("Member account already exists");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      passwordHash: args.passwordHash,
      role: args.role,
    });

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new ConvexError("Failed to create user");
    }

    return user;
  },
});

export const getMatchingMember = internalQuery({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    role: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("members")
      .withIndex("by_identity", (q) =>
        q.eq("firstName", args.firstName).eq("lastName", args.lastName).eq("role", args.role),
      )
      .unique();
  },
});

export const getPrivateUserByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const getExperiencesForUser = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("experiences")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

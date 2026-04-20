import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

function toPublicUser(user: Doc<"users">) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    major: user.major,
    graduationYear: user.graduationYear,
  };
}

async function requireAuthUser(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    throw new ConvexError("Unauthorized");
  }

  const user = await ctx.db.get(userId);

  if (!user) {
    throw new ConvexError("Unauthorized");
  }

  return user;
}

export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuthUser(ctx);
    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return {
      ...toPublicUser(user),
      experiences,
    };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    return await Promise.all(
      users.map(async (user) => {
        const experiences = await ctx.db
          .query("experiences")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();

        return {
          ...toPublicUser(user),
          experiences,
        };
      }),
    );
  },
});

export const get = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      return null;
    }

    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return {
      ...toPublicUser(user),
      experiences,
    };
  },
});

export const updateMe = mutation({
  args: {
    major: v.string(),
    graduationYear: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    const major = args.major.trim();
    const graduationYear = args.graduationYear.trim();

    if (!major) {
      throw new ConvexError("Major is required");
    }

    if (!graduationYear) {
      throw new ConvexError("Graduation year is required");
    }

    await ctx.db.patch(userId, {
      major,
      graduationYear,
    });

    const updatedUser = await ctx.db.get(userId);

    if (!updatedUser) {
      throw new ConvexError("Unauthorized");
    }

    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return {
      ...toPublicUser(updatedUser),
      experiences,
    };
  },
});

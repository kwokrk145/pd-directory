import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

function validateExperience(args: {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
}) {
  if (!args.title.trim()) {
    throw new ConvexError("Title is required");
  }

  if (!args.organization.trim()) {
    throw new ConvexError("Organization is required");
  }

  if (!args.startDate.trim()) {
    throw new ConvexError("Start date is required");
  }

  if (!args.endDate.trim()) {
    throw new ConvexError("End date is required");
  }
}

export const create = mutation({
  args: {
    title: v.string(),
    organization: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    validateExperience(args);

    const experienceId = await ctx.db.insert("experiences", {
      userId,
      title: args.title.trim(),
      organization: args.organization.trim(),
      startDate: args.startDate.trim(),
      endDate: args.endDate.trim(),
      description: args.description?.trim() || undefined,
    });

    const experience = await ctx.db.get(experienceId);

    if (!experience) {
      throw new ConvexError("Failed to create experience");
    }

    return experience;
  },
});

export const update = mutation({
  args: {
    experienceId: v.id("experiences"),
    title: v.string(),
    organization: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    validateExperience(args);

    const experience = await ctx.db.get(args.experienceId);
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    if (!experience || experience.userId !== userId) {
      throw new ConvexError("Experience not found");
    }

    await ctx.db.patch(args.experienceId, {
      title: args.title.trim(),
      organization: args.organization.trim(),
      startDate: args.startDate.trim(),
      endDate: args.endDate.trim(),
      description: args.description?.trim() || undefined,
    });

    const updatedExperience = await ctx.db.get(args.experienceId);

    if (!updatedExperience) {
      throw new ConvexError("Experience not found");
    }

    return updatedExperience;
  },
});

export const remove = mutation({
  args: {
    experienceId: v.id("experiences"),
  },
  handler: async (ctx, args) => {
    const experience = await ctx.db.get(args.experienceId);
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    if (!experience || experience.userId !== userId) {
      throw new ConvexError("Experience not found");
    }

    await ctx.db.delete(args.experienceId);

    return { message: "Experience deleted" };
  },
});

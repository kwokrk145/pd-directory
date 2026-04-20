import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

async function requireSignedIn(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    throw new ConvexError("Unauthorized");
  }
}

function requireAdminPassword(password: string) {
  const configuredPassword = process.env.ACTIVE_MEMBER_ADMIN_PASSWORD;

  if (!configuredPassword) {
    throw new ConvexError("Active member password is not configured");
  }

  if (password !== configuredPassword) {
    throw new ConvexError("Invalid active member password");
  }
}

function cleanName(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new ConvexError(`${label} is required`);
  }

  return trimmed;
}

export const verifyAccess = mutation({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSignedIn(ctx);
    requireAdminPassword(args.password);

    return { ok: true };
  },
});

export const listApproved = query({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSignedIn(ctx);
    requireAdminPassword(args.password);

    return await ctx.db.query("members").collect();
  },
});

export const addApproved = mutation({
  args: {
    password: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.number(),
  },
  handler: async (ctx, args) => {
    await requireSignedIn(ctx);
    requireAdminPassword(args.password);

    const firstName = cleanName(args.firstName, "First name");
    const lastName = cleanName(args.lastName, "Last name");

    if (!Number.isInteger(args.role)) {
      throw new ConvexError("Role number is required");
    }

    const existingRole = await ctx.db
      .query("members")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .unique();

    if (existingRole) {
      throw new ConvexError("A member with this role number already exists");
    }

    const memberId = await ctx.db.insert("members", {
      firstName,
      lastName,
      role: args.role,
    });

    const member = await ctx.db.get(memberId);

    if (!member) {
      throw new ConvexError("Failed to add member");
    }

    return member;
  },
});

export const removeApproved = mutation({
  args: {
    password: v.string(),
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    await requireSignedIn(ctx);
    requireAdminPassword(args.password);

    const member = await ctx.db.get(args.memberId);

    if (!member) {
      throw new ConvexError("Member not found");
    }

    await ctx.db.delete(args.memberId);

    return { message: "Member deleted" };
  },
});

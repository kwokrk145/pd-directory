import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
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

async function deleteUserAccount(ctx: MutationCtx, role: number) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_role", (q) => q.eq("role", role))
    .unique();

  if (!user) {
    return {
      deletedUser: false,
      deletedExperiences: 0,
      deletedAccounts: 0,
      deletedSessions: 0,
      deletedRefreshTokens: 0,
      deletedVerificationCodes: 0,
    };
  }

  const experiences = await ctx.db
    .query("experiences")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .collect();

  for (const experience of experiences) {
    await ctx.db.delete(experience._id);
  }

  const accounts = (await ctx.db.query("authAccounts").collect()).filter((account) => account.userId === user._id);
  let deletedVerificationCodes = 0;

  for (const account of accounts) {
    const verificationCodes = await ctx.db
      .query("authVerificationCodes")
      .withIndex("accountId", (q) => q.eq("accountId", account._id))
      .collect();

    for (const verificationCode of verificationCodes) {
      await ctx.db.delete(verificationCode._id);
      deletedVerificationCodes += 1;
    }

    await ctx.db.delete(account._id);
  }

  const sessions = await ctx.db
    .query("authSessions")
    .withIndex("userId", (q) => q.eq("userId", user._id))
    .collect();

  let deletedRefreshTokens = 0;

  for (const session of sessions) {
    const refreshTokens = await ctx.db
      .query("authRefreshTokens")
      .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
      .collect();

    for (const refreshToken of refreshTokens) {
      await ctx.db.delete(refreshToken._id);
      deletedRefreshTokens += 1;
    }

    await ctx.db.delete(session._id);
  }

  await ctx.db.delete(user._id);

  return {
    deletedUser: true,
    deletedExperiences: experiences.length,
    deletedAccounts: accounts.length,
    deletedSessions: sessions.length,
    deletedRefreshTokens,
    deletedVerificationCodes,
  };
}

async function updateUserIdentity(
  ctx: MutationCtx,
  previousRole: number,
  nextIdentity: { firstName: string; lastName: string; role: number },
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_role", (q) => q.eq("role", previousRole))
    .unique();

  if (!user) {
    return null;
  }

  if (previousRole !== nextIdentity.role) {
    const conflictingUser = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", nextIdentity.role))
      .unique();

    if (conflictingUser && conflictingUser._id !== user._id) {
      throw new ConvexError("A user with this role number already exists");
    }
  }

  await ctx.db.patch(user._id, {
    firstName: nextIdentity.firstName,
    lastName: nextIdentity.lastName,
    name: `${nextIdentity.firstName} ${nextIdentity.lastName}`,
    role: nextIdentity.role,
  });

  return await ctx.db.get(user._id);
}

async function deleteMemberAndAccount(ctx: MutationCtx, memberId: Id<"members">) {
  const member = await ctx.db.get(memberId);

  if (!member) {
    throw new ConvexError("Member not found");
  }

  const deletedAccount = await deleteUserAccount(ctx, member.role);
  await ctx.db.delete(memberId);

  return {
    message: "Member deleted",
    deletedAccount,
  };
}

async function updateMemberAndAccount(
  ctx: MutationCtx,
  memberId: Id<"members">,
  nextIdentity: { firstName: string; lastName: string; role: number },
) {
  const member = await ctx.db.get(memberId);

  if (!member) {
    throw new ConvexError("Member not found");
  }

  if (member.role !== nextIdentity.role) {
    const existingRole = await ctx.db
      .query("members")
      .withIndex("by_role", (q) => q.eq("role", nextIdentity.role))
      .unique();

    if (existingRole && existingRole._id !== memberId) {
      throw new ConvexError("A member with this role number already exists");
    }
  }

  await ctx.db.patch(memberId, {
    firstName: nextIdentity.firstName,
    lastName: nextIdentity.lastName,
    role: nextIdentity.role,
  });

  const updatedUser = await updateUserIdentity(ctx, member.role, nextIdentity);
  const updatedMember = await ctx.db.get(memberId);

  if (!updatedMember) {
    throw new ConvexError("Failed to update member");
  }

  return {
    member: updatedMember,
    user: updatedUser,
  };
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
    return await deleteMemberAndAccount(ctx, args.memberId);
  },
});

export const updateApproved = mutation({
  args: {
    password: v.string(),
    memberId: v.id("members"),
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

    return await updateMemberAndAccount(ctx, args.memberId, {
      firstName,
      lastName,
      role: args.role,
    });
  },
});

export const queueSelfRemoval = mutation({
  args: {
    password: v.string(),
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    requireAdminPassword(args.password);

    const member = await ctx.db.get(args.memberId);

    if (!member) {
      throw new ConvexError("Member not found");
    }

    const user = await ctx.db.get(userId);

    if (!user || user.role !== member.role) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.scheduler.runAfter(2000, internal.members.deleteApprovedInternal, {
      memberId: args.memberId,
    });

    return { queued: true };
  },
});

export const deleteApprovedInternal = internalMutation({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    return await deleteMemberAndAccount(ctx, args.memberId);
  },
});

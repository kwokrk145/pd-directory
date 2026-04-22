import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { DataModel } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

const SESSION_DURATION_MS = 30 * 60 * 1000;

function normalizeEmail(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    throw new ConvexError("Email is required");
  }

  return value.trim().toLowerCase();
}

function requiredString(value: unknown, message: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new ConvexError(message);
  }

  return value.trim();
}

function parseRole(value: unknown) {
  const role = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(role)) {
    throw new ConvexError("Role number is required");
  }

  return role;
}

const MemberPassword = Password<DataModel>({
  profile(params) {
    const email = normalizeEmail(params.email);

    if (params.flow !== "signUp") {
      return { email } as never;
    }

    const firstName = requiredString(params.firstName, "First name is required");
    const lastName = requiredString(params.lastName, "Last name is required");
    const role = parseRole(params.role);

    return {
      email,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      role,
    };
  },
  validatePasswordRequirements(password) {
    if (password.length < 8) {
      throw new ConvexError("Password must be at least 8 characters long");
    }
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [MemberPassword],
  session: {
    totalDurationMs: SESSION_DURATION_MS,
    inactiveDurationMs: SESSION_DURATION_MS,
  },
  jwt: {
    durationMs: SESSION_DURATION_MS,
    customClaims: async (ctx, { userId, sessionId }) => {
      const user = await ctx.db.get(userId);

      return {
        sessionId,
        role: user?.role,
      };
    },
  },
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const appCtx = ctx as unknown as MutationCtx;
      const email = normalizeEmail(args.profile.email);

      if (
        args.existingUserId !== null &&
        (!("firstName" in args.profile) || !("lastName" in args.profile) || !("role" in args.profile))
      ) {
        return args.existingUserId;
      }

      const firstName = requiredString(args.profile.firstName, "First name is required");
      const lastName = requiredString(args.profile.lastName, "Last name is required");
      const role = parseRole(args.profile.role);

      const member = await appCtx.db
        .query("members")
        .withIndex("by_identity", (q) =>
          q.eq("firstName", firstName).eq("lastName", lastName).eq("role", role),
        )
        .unique();

      if (!member) {
        throw new ConvexError("Name and role number do not match an approved member");
      }

      const existingEmail = await appCtx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", email))
        .unique();

      if (existingEmail) {
        throw new ConvexError("Email already exists");
      }

      const existingRole = await appCtx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", role))
        .unique();

      if (existingRole) {
        throw new ConvexError("Member account already exists");
      }

      return await appCtx.db.insert("users", {
        email,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        role,
      });
    },
  },
});

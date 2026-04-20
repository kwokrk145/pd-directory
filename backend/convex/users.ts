import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { makeFunctionReference } from "convex/server";
import type { FunctionReference } from "convex/server";

const PASSWORD_ITERATIONS = 100_000;
const PASSWORD_HASH_ALGORITHM = "PBKDF2-SHA256";

type PublicUser = {
  id: Id<"users">;
  email: string;
  firstName: string;
  lastName: string;
  role: number;
  major?: string;
  graduationYear?: string;
};

const createRegisteredUser = makeFunctionReference("internalUsers:createRegisteredUser") as unknown as FunctionReference<
  "mutation",
  "internal",
  {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    role: number;
  },
  Doc<"users">
>;

const getMatchingMember = makeFunctionReference("internalUsers:getMatchingMember") as unknown as FunctionReference<
  "query",
  "internal",
  {
    firstName: string;
    lastName: string;
    role: number;
  },
  Doc<"members"> | null
>;

const getPrivateUserByEmail = makeFunctionReference("internalUsers:getPrivateUserByEmail") as unknown as FunctionReference<
  "query",
  "internal",
  { email: string },
  Doc<"users"> | null
>;

const getExperiencesForUser = makeFunctionReference("internalUsers:getExperiencesForUser") as unknown as FunctionReference<
  "query",
  "internal",
  { userId: Id<"users"> },
  Doc<"experiences">[]
>;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

function toPublicUser(user: {
  _id: Id<"users">;
  email: string;
  firstName: string;
  lastName: string;
  role: number;
  major?: string;
  graduationYear?: string;
}): PublicUser {
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

async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: PASSWORD_ITERATIONS,
    },
    key,
    256,
  );

  return `${PASSWORD_HASH_ALGORITHM}:${PASSWORD_ITERATIONS}:${bytesToHex(salt)}:${bytesToHex(
    new Uint8Array(hash),
  )}`;
}

async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  const [algorithm, iterations, saltHex, hashHex] = passwordHash.split(":");

  if (algorithm !== PASSWORD_HASH_ALGORITHM || !iterations || !saltHex || !hashHex) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: hexToBytes(saltHex),
      iterations: Number(iterations),
    },
    key,
    256,
  );

  return bytesToHex(new Uint8Array(hash)) === hashHex;
}

export const register = action({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.number(),
  },
  handler: async (ctx, args): Promise<PublicUser> => {
    const firstName = args.firstName.trim();
    const lastName = args.lastName.trim();
    const email = normalizeEmail(args.email);
    const role = args.role;

    if (!firstName) {
      throw new ConvexError("First name is required");
    }

    if (!lastName) {
      throw new ConvexError("Last name is required");
    }

    if (!email) {
      throw new ConvexError("Email is required");
    }

    if (args.password.length < 6) {
      throw new ConvexError("Password must be at least 6 characters long");
    }

    const member = await ctx.runQuery(getMatchingMember, {
      firstName,
      lastName,
      role,
    });

    if (!member) {
      throw new ConvexError("Name and role number do not match an approved member");
    }

    const passwordHash = await hashPassword(args.password);
    const user = await ctx.runMutation(createRegisteredUser, {
      firstName,
      lastName,
      email,
      passwordHash,
      role,
    });

    return toPublicUser(user);
  },
});

export const login = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<PublicUser & { experiences: Doc<"experiences">[] }> => {
    const user = await ctx.runQuery(getPrivateUserByEmail, {
      email: normalizeEmail(args.email),
    });

    if (!user) {
      throw new ConvexError("Invalid email or password");
    }

    const validPassword = await verifyPassword(args.password, user.passwordHash);

    if (!validPassword) {
      throw new ConvexError("Invalid email or password");
    }

    const experiences = await ctx.runQuery(getExperiencesForUser, {
      userId: user._id,
    });

    return {
      ...toPublicUser(user),
      experiences,
    };
  },
});

export const logout = action({
  args: {},
  handler: async () => {
    return { message: "Logged out" };
  },
});

export const me = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new ConvexError("Unauthorized");
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

export const list = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    return users.map(toPublicUser);
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
    userId: v.id("users"),
    major: v.string(),
    graduationYear: v.string(),
  },
  handler: async (ctx, args) => {
    const major = args.major.trim();
    const graduationYear = args.graduationYear.trim();

    if (!major) {
      throw new ConvexError("Major is required");
    }

    if (!graduationYear) {
      throw new ConvexError("Graduation year is required");
    }

    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(args.userId, {
      major,
      graduationYear,
    });

    const updatedUser = await ctx.db.get(args.userId);
    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return {
      ...toPublicUser(updatedUser!),
      experiences,
    };
  },
});

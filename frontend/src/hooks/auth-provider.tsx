import { createContext, useCallback, useMemo, type ReactNode } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@convex-api";
import type { UserType } from "../lib/types";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error) {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }

  return "";
}

function normalizeAuthError(error: unknown, flow: "signIn" | "signUp") {
  const message = getErrorMessage(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes("incorrect password") ||
    normalized.includes("invalid password") ||
    normalized.includes("invalid credentials") ||
    normalized.includes("invalid login") ||
    normalized.includes("unauthorized")
  ) {
    return new Error("Incorrect email or password.");
  }

  if (normalized.includes("password must be at least 8 characters")) {
    return new Error("Password must be at least 8 characters.");
  }

  if (normalized.includes("member account already exists") || normalized.includes("already exists")) {
    return new Error("An account already exists for this member.");
  }

  if (normalized.includes("approved member")) {
    return new Error("Your name and role number do not match an approved member.");
  }

  if (normalized.includes("email is required")) {
    return new Error("Enter your email address.");
  }

  if (normalized.includes("first name is required") || normalized.includes("last name is required")) {
    return new Error("Enter your first and last name.");
  }

  if (normalized.includes("role number is required")) {
    return new Error("Enter your role number.");
  }

  if (message) {
    return new Error(message);
  }

  return new Error(
    flow === "signIn"
      ? "Unable to sign in. Check your credentials and try again."
      : "Unable to create your account. Verify your information and try again.",
  );
}

export type AuthContextValue = {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: number,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const profile = useQuery(api.users.me, isAuthenticated ? {} : "skip");

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        await convexSignIn("password", {
          email,
          password,
          flow: "signIn",
        });
      } catch (error) {
        throw normalizeAuthError(error, "signIn");
      }
    },
    [convexSignIn],
  );

  const signUp = useCallback(
    async (firstName: string, lastName: string, email: string, password: string, role: number) => {
      try {
        await convexSignIn("password", {
          firstName,
          lastName,
          email,
          password,
          role,
          flow: "signUp",
        });
      } catch (error) {
        throw normalizeAuthError(error, "signUp");
      }
    },
    [convexSignIn],
  );

  const signOut = useCallback(async () => {
    await convexSignOut();
  }, [convexSignOut]);

  const refreshUser = useCallback(async () => {
    // Convex queries are reactive, so this is kept for existing callers.
  }, []);

  const isProfileLoading = isAuthenticated && profile === undefined;
  const user: UserType | null = profile
    ? {
        ...profile,
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        experiences: profile.experiences?.map((experience) => ({
          ...experience,
          id: experience._id,
        })),
      }
    : null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: isAuthenticated && user !== null,
      isLoading: isAuthLoading || isProfileLoading,
      signIn,
      signUp,
      signOut,
      refreshUser,
    }),
    [user, isAuthenticated, isAuthLoading, isProfileLoading, signIn, signUp, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

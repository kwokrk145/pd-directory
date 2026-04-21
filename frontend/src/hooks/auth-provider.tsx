import { createContext, useCallback, useMemo, type ReactNode } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@convex-api";
import type { Experience, UserType } from "../lib/types";
import { normalizeAuthError } from "../lib/auth-errors";

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
        experiences: profile.experiences?.map((experience: Experience) => ({
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

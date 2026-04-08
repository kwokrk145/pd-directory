import { useStore } from "@nanostores/react";
import { register, login, logout } from "../data/api";
import { $user, clearUser, setUser } from "../lib/store";
import { toast } from "sonner";

function useAuth() {

    const user = useStore($user);
    
    const signIn = async (email: string, password: string) => {
        try {
            const profile = await login(email, password);
            setUser(profile);
            return true;
        } catch (error) {
            const errorMessage = (error as Error).message ?? "Sign in Failed! Please try again later!";
            toast.error("Login failed: " + errorMessage);
            return false;

        }
    }

    const signUp = async (firstName: string, lastName: string,  email: string, password: string) => {
        try {
            const profile = await register(firstName, lastName, email, password);
            setUser(profile);
            return true;
        } catch (error) {
            const errorMessage = (error as Error).message ?? "Registration Failed! Please try again later!";
            toast.error("Registration failed: " + errorMessage);
            return false;
        }
    }

    const signOut = async () => {
        try {
            await logout();
            clearUser();
            return true;
        } catch (error) {
            const errorMessage = (error as Error).message ?? "Logout Failed! Please try again later!";
            toast.error("Logout failed: " + errorMessage);
            return false;
        }
    }
    return { user, signIn, signUp, signOut };
}

export default useAuth;
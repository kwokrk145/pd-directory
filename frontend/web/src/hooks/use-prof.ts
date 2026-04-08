import { getAllUsers, getUserById, getUserProfile } from "../data/api";
import { toast } from "sonner";


function useProfile() {
    const fetchUsers = async () => {
        try {
            const users = await getAllUsers();
            return users;
        } catch (error) {
            const errorMessage = (error as Error).message ?? "Couldn't fetch users! Please try again later!";
            toast.error("Fetch users failed: " + errorMessage);
            return false;
        }
    };

    const fetchUserById = async (userId: number) => {
        try {
            const user = await getUserById(userId);
            return user;
        } catch (error) {
            const errorMessage = (error as Error).message ?? "Couldn't fetch user! Please try again later!";
            toast.error("Fetch user failed: " + errorMessage);
            return false;
        }
    };

    const fetchProf = async () => {
        try {
            const profile = await getUserProfile();
            return profile;
        } catch (error) {
            const errorMessage = (error as Error).message ?? "Couldn't fetch profile! Please try again later!";
            toast.error("Fetch profile failed: " + errorMessage);
            return false;
        }
    };
    return { fetchUsers, fetchUserById, fetchProf }

};

export default useProfile;
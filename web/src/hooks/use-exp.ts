import { toast } from "sonner";
import { createExperience, updateExperience, deleteExperience } from "../data/api";

function useExp() {
    const addExperience = async (
        title: string, 
        organization: string,
        startDate: string, 
        endDate: string, 
        description?:string) => {
            try {
                const experience = await createExperience(title, organization, startDate, endDate, description);
                toast.success("Experience added successfully!");
                return experience;
            } catch (error) {
                const errorMessage = (error as Error).message ?? "Couldn't add experience! Please try again later!";
                toast.error("Add experience failed: " + errorMessage);
                return false;
            }
    };

    const editExperience = async (
        id: number,
        title: string,
        organization: string,
        startDate: string,
        endDate: string,
        description?:string) => {
            try {
                const experience = await updateExperience(id, title, organization, startDate, endDate, description);
                toast.success("Experience updated successfully!");
                return experience;
            } catch (error) {
                const errorMessage = (error as Error).message ?? "Couldn't update experience! Please try again later!";
                toast.error("Update experience failed: " + errorMessage);
                return false;
            }
    };

    const removeExperience = async (experienceId: number) => {
        try {
            await deleteExperience(experienceId);
            toast.success("Experience deleted successfully!");
            return true;
        } catch (error) {
            const errorMessage = (error as Error).message ?? "Couldn't delete experience! Please try again later!";
            toast.error("Delete experience failed: " + errorMessage);
            return false;
        }
    };
    return { addExperience, editExperience, removeExperience };
}

export default useExp;
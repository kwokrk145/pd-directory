import { toast } from "sonner";
import { createExperience, updateExperience, deleteExperience } from "../data/api";

const validateDates = (
    startMonth: string,
    startYear: string,
    endMonth: string,
    endYear: string,
    currentlyWorking: boolean,
): boolean => {
    if (!startYear || !startMonth) {
        toast.error("Please fill in all the dates!");
        return false;
    }

    if (!currentlyWorking) {
        if (!endYear || !endMonth) {
            toast.error("Please fill in all the dates!");
            return false;
        }
    } else {
        return true;
    }

    const startYearNum = Number(startYear);
    const endYearNum = Number(endYear);

    // Check if start year is later than end year
    if (startYearNum > endYearNum) {
        toast.error("Start year cannot be later than end year!");
        return false;
    }

    // If years are the same, check months
    if (startYearNum === endYearNum) {
        const months = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
        const startMonthIndex = months.indexOf(startMonth);
        const endMonthIndex = months.indexOf(endMonth);

        if (startMonthIndex > endMonthIndex) {
            toast.error("Start month cannot be later than end month in the same year!");
            return false;
        }
    }

    return true;
};

function useExp() {
    const addExperience = async (
        title: string, 
        organization: string,
        startMonth: string, 
        startYear: string,
        endMonth: string,
        endYear: string,
        currentlyWorking: boolean,
        description?: string,
    ) => {
            try {
                if (!validateDates(startMonth, startYear, endMonth, endYear, currentlyWorking)) {
                    return false;
                }

                const startDate = `${startMonth} ${startYear}`;
                if (currentlyWorking) {
                    endMonth = "Present";
                    endYear = "";
                }
                const endDate = `${endMonth} ${endYear}`;
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
        startMonth: string,
        startYear: string,
        endMonth: string,
        endYear: string,
        currentlyWorking: boolean,
        description?:string,
    ) => {
            try {
                if (!validateDates(startMonth, startYear, endMonth, endYear, currentlyWorking)) {
                    return false;
                }

                const startDate = `${startMonth} ${startYear}`;
                if (currentlyWorking) {
                    endMonth = "Present";
                    endYear = "";
                }
                const endDate = `${endMonth} ${endYear}`;
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
import { API_URL } from "../env";
import type { Experience, UserType } from "./types";

// ACCOUNT AUTHENTICATION API CALLS
// ----------------------------------

// registering a new user
export const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
): Promise<UserType> => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ firstName, lastName, email, password }),
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data as UserType;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

// logging in 
export const login = async (
    email: string,
    password: string
): Promise<UserType> => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password}),
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }

        return data as UserType;

    } catch (error ) {
        throw new Error((error as Error).message);
    }
    

};


// logging out
export const logout = async (): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to logout");
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
};


// PROFILE API CALLS
// ------------------------------

// fetching current user profile
export const getUserProfile = async (): Promise<UserType> => {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data as UserType;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

// fetching all users
export const getAllUsers = async (): Promise<UserType[]> => {
    try {
        const response = await fetch(`${API_URL}/profile/users`, { 
            method: "GET",
            credentials: "include",
        });
        const data = await response.json(); 
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data as UserType[];
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

// fetching a user by ID
export const getUserById = async (userId: number): Promise<UserType> => {
    try {
        const response = await fetch(`${API_URL}/profile/users/${userId}`, {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data as UserType;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

// EXPERIENCE API CALLS
// ------------------------------

// create experience
export const createExperience = async (
    title: string, 
    organization: string,
    startDate: string, 
    endDate: string, 
    description?:string): Promise<Experience> => {  
        try {
            const response = await fetch(`${API_URL}/experience`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ title, organization, startDate, endDate, description }),
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            return data as Experience;
        } catch (error) {
            throw new Error((error as Error).message);
        }
};
// update experience
export const updateExperience = async (
    experienceId: number,
    title: string, 
    organization: string, 
    startDate: string, 
    endDate: string, 
    description?:string): Promise<Experience> => {
        try {
            const response = await fetch(`${API_URL}/experience/${experienceId}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ title, organization, startDate, endDate, description }),
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            return data as Experience;
        } catch (error) {
            throw new Error((error as Error).message);
        }

}

// delete experience
export const deleteExperience = async (experienceId: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/experience/${experienceId}`, { 
            method: "DELETE",
            credentials: "include",
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
}
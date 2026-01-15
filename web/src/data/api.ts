import { API_URL } from "../env";
import type { UserType } from "./types";

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
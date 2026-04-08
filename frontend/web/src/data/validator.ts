import type { LoginInfo, RegisterInfo } from "./types";
import { toast } from "sonner";


export const validateLoginInfo = (info: LoginInfo) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!info.email && !info.password) {
        toast.error("Please fill in all fields.");
        return false;
    }
    if (info.email.trim() === "") {
        toast.error("Please enter your email address.");
        return false;
    }
    if (info.password.trim() === "") {
        toast.error("Please enter your password.");
        return false;
    }

    if (!emailRegex.test(info.email)) {
        toast.error("Please enter a valid email address.");
        return false;
    }
    return true;
}
export const validateRegisterInfo = (info: RegisterInfo): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!info.email && !info.firstName.trim() && !info.lastName.trim() && !info.password && !info.confirmPassword) {
        toast.error("Please fill in all fields.");
        return false;
    }
    if (!emailRegex.test(info.email)) {
        toast.error("Please enter a valid email address.");
        return false;
    }
    if (info.firstName.trim() === ""){
        toast.error("Please fill in your first name.");
        return false;
    }
    if (info.lastName.trim() === ""){
        toast.error("Please fill in your last name.");
        return false;
    }

    if (info.password.trim() === "" || info.confirmPassword.trim() === "") {
        toast.error("Password fields cannot be empty.");
        return false;
    }
    const passwordsMatch = info.password === info.confirmPassword;
    if (!passwordsMatch) {
        toast.error("Passwords do not match.");
        return false;
    }
    return true;
}
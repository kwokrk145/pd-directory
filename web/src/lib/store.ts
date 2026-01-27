import { $router } from "./router";
import { openPage } from "@nanostores/router";
import { map } from "nanostores";
import type { UserType } from "../data/types";


const defaultUser: UserType = {
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    experiences: [],
}

export const $user = map<UserType>(defaultUser);

export function setUser(user: UserType) {
    $user.set(user);
}

export function clearUser() {
    $user.set(defaultUser);
}

export const navigateToPage = (page: "home" | "login" | "register" | "profile" | "members") => {
    openPage($router, page);

}


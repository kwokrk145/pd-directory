import { BASE_URL } from "../env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
    home: `${BASE_URL}`,
    login: `${BASE_URL}login`,
});
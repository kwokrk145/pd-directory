import { $router } from "./router";
import { openPage } from "@nanostores/router";



export const navigateToPage = (page: "home" | "login" | "register") => {
    openPage($router, page);

}


import { useStore } from "@nanostores/react";
import { Button } from "../components/ui/button";
import { $user, clearUser, navigateToPage } from "../lib/store";
import { FaUserCircle } from "react-icons/fa";


const Sidebar = () => {
    const user = useStore($user);
    const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        clearUser();
        navigateToPage("home");
    }

    return (
        <div className="sticky top-0 z-50 flex flex-row items-center p-4 px-12 border-b bg-white/70 backdrop-blur-md">
            <header onClick={() => navigateToPage("home")} className="text-xl cursor-pointer font-bold ">Theta Tau</header>
            <div className="flex ml-auto  space-x-4 items-center">
                <p onClick={() => navigateToPage("members")} className="text-gray-500 cursor-pointer">Members</p>
                {user.id === "" && <Button onClick={() => navigateToPage("login")} className="cursor-pointer hover-lift">Sign in</Button>}
                {user.id !== "" && <Button onClick={handleSignOut} className="cursor-pointer hover-lift">Sign out</Button> } 
                {user.id !== "" && <FaUserCircle size={32} onClick={() => navigateToPage("profile")} className="text-black-400 cursor-pointer" />}

            </div>
        </div>
    );
};

export default Sidebar;
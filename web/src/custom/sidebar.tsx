import { Button } from "../components/ui/button";


const Sidebar = () => {
    return (
        <div className="sticky top-0 z-50 flex flex-row items-center p-4 px-12 border-b bg-white/70 backdrop-blur-md">
            <header className="text-xl cursor-pointer font-bold ">Theta Tau</header>
            <div className="flex ml-auto  space-x-4 items-center">
                <p className="text-gray-500 cursor-pointer">Members</p>
                <Button className="cursor-pointer hover-lift">Sign in</Button>

            </div>
        </div>
    );
};

export default Sidebar;
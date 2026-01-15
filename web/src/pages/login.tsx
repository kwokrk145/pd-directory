import { Info } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import type { LoginInfo } from "../data/types";
import { validateLoginInfo } from "../data/validator";
import useAuth from "../hooks/use-auth";
import { navigateToPage } from "../lib/store";
const Login = () => {

    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as LoginInfo;
        if (validateLoginInfo(data)) {
            const success = await signIn(data.email, data.password);
            if (success) {
                navigateToPage("profile");
            }
        }
    }
    return (
        <div className=" flex-1 min-h-0 bg-[url('/hopkins.jpg')] md:bg-[50%_45%] bg-no-repeat bg-center bg-cover px-6 md:px-10 py-8">
            <div className="flex flex-col md:flex-row gap-6 bg-white/95 space-x-8 md:space-x-10 w-full max-w-5xl mx-auto p-6 md:p-10 border border-black rounded-[32px]">
                <div className="flex-1 flex flex-col justify-center rounded-3xl w-full gap-2 p-4 md:p-6">
                    <p className="text-3xl font-semibold mb-2">Welcome Back</p>
                    <p className="text-base text-gray-500">Enter your credentials to access your account</p>
                    <div className="flex items-center border border-gray-300 rounded-lg p-4 text-gray-500 mt-4 bg-gray-200">
                        <Info className="inline-block mr-2" /> 
                        Only Theta Tau fraternity members can accesss this portal.
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label className="block text-md font-medium text-gray-700 mt-6 mb-2">Email Address</label>
                        <Input name="email" type="email" placeholder="your.email@example.com" />
                        <label className="block text-md font-medium text-gray-700 mt-6 mb-2">Password</label>
                        <Input name="password" type="password" placeholder="Enter your password" />
                        <Button type="submit" className="cursor-pointer w-full mt-12 bg-black text-white hover-lift">Sign in</Button>
                        <div className="flex justify-center mt-4">
                            <p>Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register Here</a></p>
                        </div>
                    </form>
                </div>
                <div className="flex-1 hidden md:block border bg-[url('/utl.jpg')] bg-no-repeat bg-cover bg-center border-black rounded-3xl w-full p-4 md:p-6"></div>
            </div>
        </div>
        
    );
}

export default Login;
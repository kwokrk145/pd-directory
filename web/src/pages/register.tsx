import { Info } from "lucide-react";
import { Input } from "../components/ui/input";
import { validateRegisterInfo } from "../data/validator";
import type { RegisterInfo } from "../data/types";

const Register = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as RegisterInfo;
    validateRegisterInfo(data)
  }
  return (
    <div className="flex-1 md:bg-[50%_55%] min-h-0 w-full bg-[url('/snowjhu.JPEG')] bg-no-repeat bg-center bg-cover px-6 md:px-10 py-8 flex items-center justify-center">
      <div className="flex flex-col w-full h-full flex-1 gap-4 bg-white/95 max-w-xl border rounded-[32px] py-12 px-12 md:px-16 md:py-12">
        <p className="text-3xl font-semibold">Create Account</p>
        <div className="flex items-center border border-gray-300 rounded-lg p-4 text-gray-500 bg-gray-200">
            <Info className="inline-block mr-2" /> 
            Only Theta Tau fraternity members can register an account.
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <div className="flex flex-row gap-6 items-center justify-center mb-4">
                <div className="flex flex-col flex-1 ">
                    <label className="text-md font-medium text-gray-700">First Name</label>
                    <Input name="firstName" type="text" placeholder="First Name" className="w-full mt-2"/>
                </div>
                <div className="flex flex-col flex-1"  >
                    <label className="text-md font-medium text-gray-700">Last Name</label>
                    <Input name="lastName" type="text" placeholder="Last Name" className="w-full mt-2"/>
                </div>
            </div>

            <label className="text-md font-medium text-gray-700">Email Address</label>
            <Input name="email" type="email" placeholder="your.email@jh.edu" className="w-full mt-2 mb-4"/>
            <label className="text-md font-medium text-gray-700">Password</label>
            <Input name="password" type="password" placeholder="Enter your password" className="w-full mt-2 mb-4"/>
            <label className="text-md font-medium text-gray-700">Confirm Password</label>
            <Input name="confirmPassword" type="password" placeholder="Confirm password" className="w-full mt-2 mb-4"/>
            <button type="submit" className="cursor-pointer w-full mt-2 bg-black text-white py-2 rounded-md hover-lift">Register</button>

        </form>
        
      </div>
    </div>
  );
}
export default Register;
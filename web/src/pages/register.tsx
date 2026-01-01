import { Info } from "lucide-react";
import { Input } from "../components/ui/input";

const Register = () => {
  return (
    <div className="flex-1 md:bg-[50%_55%] min-h-0 w-full bg-[url('/snowjhu.JPEG')] bg-no-repeat bg-center bg-cover px-6 md:px-10 py-8 flex items-center justify-center">
      <div className="flex flex-col w-full h-full flex-1 gap-4 bg-white/95 max-w-xl border rounded-[32px] py-12 px-12 md:px-16 md:py-12">
        <p className="text-3xl font-semibold">Create Account</p>
        <div className="flex items-center border border-gray-300 rounded-lg p-4 text-gray-500 bg-gray-200">
            <Info className="inline-block mr-2" /> 
            Account creation requires a registration passcode provided to verified Theta Tau members.
        </div>
        <form>
            <div className="flex flex-row gap-6 items-center justify-center mb-4">
                <div className="flex flex-col flex-1 ">
                    <label className="text-md font-medium text-gray-700">First Name</label>
                    <Input type="text" placeholder="First Name" className="w-full mt-2"/>
                </div>
                <div className="flex flex-col flex-1"  >
                    <label className="text-md font-medium text-gray-700">Last Name</label>
                    <Input type="text" placeholder="Last Name" className="w-full mt-2"/>
                </div>
            </div>

            <label className="text-md font-medium text-gray-700">JHU Email Address</label>
            <Input type="email" placeholder="your.email@example.com" className="w-full mt-2 mb-4"/>
            <label className="text-md font-medium text-gray-700">Password</label>
            <Input type="password" placeholder="Enter your password" className="w-full mt-2 mb-4"/>
            <label className="text-md font-medium text-gray-700">Registration Code</label>
            <Input type="password" placeholder="Enter the registration code" className="w-full mt-2 mb-4"/>
            <button type="submit" className="cursor-pointer w-full mt-2 bg-black text-white py-2 rounded-md hover-lift">Register</button>

        </form>
        
      </div>
    </div>
  );
}
export default Register;
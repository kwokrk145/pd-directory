import { useStore } from "@nanostores/react";
import { $user } from "../lib/store";
import { Button } from "../components/ui/button";

const Profile = () => {
  const user = useStore($user);

  return (
    <div className="w-full flex justify-center mt-10 gap-8">
      {/* Shared column */}
      <div className="w-full flex flex-col max-w-5xl gap-8">
        {/* Profile card */}
        <div className="flex flex-col items-center border rounded-lg border-gray-500 p-8 shadow-md">
          <h1 className="font-bold text-2xl">
            {user.firstName} {user.lastName}
          </h1>
          <p>{user.email}</p>
        </div>
        {/* Experience section */}
        <div className="flex flex-row justify-between items-center">
            <div>
                <h1 className="font-bold text-2xl mb-3">Experience</h1>
                <p className="text-gray-600">
                    Your professional and academic experience
                </p>
            </div>
            <Button className="cursor-pointer hover-lift text-base p-5">Add Experience</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

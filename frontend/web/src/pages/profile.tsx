import { useStore } from "@nanostores/react";
import { $user, setUser } from "../lib/store";
import AddExperience from "../components/ui/add-experience";
import Experiences  from "../components/ui/experience";
import { useEffect, useState } from "react";
import useProfile from "../hooks/use-prof";


const Profile = () => {
  const user = useStore($user);
  const { fetchProf } = useProfile();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await fetchProf();  
      if (profile) {
        setUser(profile);
      }
    };
    loadProfile();
  }, [refresh, fetchProf]);

  return (
    <div className="w-full flex justify-center mt-10 gap-8 p-8 md:p-0 mb-10">
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
            <AddExperience setRefresh={setRefresh} />
        </div>
        {
          user.experiences && user.experiences.length > 0 && (
            user.experiences.map((exp) => (
              <Experiences key={exp.id} experience={exp} setRefresh={setRefresh} />
            ))
          )
        }
      </div>
    </div>
  );
};

export default Profile;

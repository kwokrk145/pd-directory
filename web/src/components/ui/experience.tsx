import type { Experience } from "../../data/types";
import { FaRegTrashCan } from "react-icons/fa6";
import useExp from "../../hooks/use-exp";
import EditExperience from "./edit-experience";



type experienceProps = {
    experience: Experience;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
const Experiences = ({experience, setRefresh}: experienceProps) => {
    const { removeExperience } = useExp();
    return (
        <div className="border rounded-lg border-gray-500 p-6 shadow-md">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row ">
                    <h1 className="font-bold text-xl">{experience.title}</h1>
                    <div className="ml-auto flex flex-row items-center">
                        <EditExperience experience={experience} setRefresh={setRefresh}/>
                        <FaRegTrashCan 
                            className="ml-4 text-lg cursor-pointer" 
                            onClick={() => {
                                removeExperience(experience.id);
                                setRefresh(prev => !prev);
                            }} 
                        />
                    </div>
                    
                </div>
                
                <div className="flex flex-row gap-x-4">
                    <p className="font-semibold">{experience.organization}</p>
                </div>
                <div>
                    <p className="font-semibold">{experience.startDate} - {experience.endDate}</p>
                </div>
                <div>
                    <p className="text-gray-600">{experience.description}</p>
                </div>

            </div>            
        </div>
    );
};

export default Experiences;
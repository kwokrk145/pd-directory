import type { Experience } from "../../data/types";

type experienceProps = {
    experience: Experience;
}
const Experiences = ({experience}: experienceProps) => {
    return (
        <div className="border rounded-lg border-gray-500 p-6 shadow-md">
            <div className="flex flex-col gap-2">
                <h1 className="font-bold text-xl">{experience.title}</h1>
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
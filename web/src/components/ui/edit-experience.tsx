import { useState } from "react";
import useExp from "../../hooks/use-exp";
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea";
import type { Experience } from "../../data/types";
import { MdOutlineModeEdit } from "react-icons/md";


type EditExperienceProps = {
    experience: Experience;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditExperience = ({ experience, setRefresh }: EditExperienceProps) => {
    const { editExperience } = useExp();
    
    const [formData, setFormData] = useState({
        title: experience.title,
        organization: experience.organization,
        start: experience.startDate,
        end: experience.endDate,
        description: experience.description
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await editExperience(experience.id, formData.title, 
                      formData.organization,
                      formData.start,
                      formData.end,
                      formData.description);
        
        setFormData({
            title: experience.title,
            organization: experience.organization,
            start: experience.startDate,
            end: experience.endDate,
            description: experience.description
        });
        setRefresh(prev => !prev);
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <MdOutlineModeEdit className="ml-auto text-xl cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">Edit Experience</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="title">Title</Label>
                                <Input 
                                    id="title" 
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Engineer" 
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="organization">Organization</Label>
                                <Input 
                                    id="organization" 
                                    value={formData.organization}
                                    onChange={handleChange}
                                    placeholder="e.g. Google" 
                                />
                            </div>
                            <div className="flex flex-row justify-between gap-4">
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="start">Start Date</Label>
                                    <Input 
                                        id="start" 
                                        value={formData.start}
                                        onChange={handleChange}
                                        placeholder="e.g. January 2020" 
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="end">End Date</Label>
                                    <Input 
                                        id="end" 
                                        value={formData.end}
                                        onChange={handleChange}
                                        placeholder="e.g. December 2021 or Present" 
                                    />
                                </div>
                            </div>
                            
                            <div className="grid gap-3">
                                <Label htmlFor="description">Description</Label>
                                <Textarea 
                                    id="description" 
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief description of your role and achievements" 
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button className="cursor-pointer mt-6" type="submit">Save</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditExperience;
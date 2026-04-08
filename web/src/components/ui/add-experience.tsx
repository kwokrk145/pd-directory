import { useState } from "react";
import useExp from "../../hooks/use-exp";
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea";

const AddExperience = ({ setRefresh }: { setRefresh: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { addExperience } = useExp();
    const [open, setOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        title: "",
        organization: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        description: "",
        currentlyWorking: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const checked = formData.currentlyWorking;

        const result = await addExperience(
            formData.title, 
            formData.organization,
            formData.startMonth,
            formData.startYear,
            formData.endMonth,
            formData.endYear,
            checked,
            formData.description,
        );
        if (!result) {
            return;
        }
        setFormData({
            title: "",
            organization: "",
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: "",
            description: "",
            currentlyWorking: false
        });
        setOpen(false);
        setRefresh(prev => !prev);
    };

    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 50}, (_, i) => currentYear - i);

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="cursor-pointer hover-lift text-base p-5">Add Experience</Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">Add New Experience</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3 mt-3">
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
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="currentlyWorking"
                                    checked={formData.currentlyWorking}
                                    onChange={handleChange}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <Label htmlFor="currentlyWorking" className="cursor-pointer">
                                    Currently working here
                                </Label>
                            </div>
                            <div className="flex flex-row justify-between gap-4">
                                <div className="grid gap-3 w-full">
                                    <Label>Start Date</Label>
                                    <div className="flex gap-2">
                                        <select 
                                            id="startMonth"
                                            value={formData.startMonth}
                                            onChange={handleChange}
                                            className="flex-1 px-3 py-2 border text-sm border-gray-300 rounded"
                                        >
                                            <option value="">Month</option>
                                            {months.map(month => (
                                                <option key={month} value={month}>{month}</option>
                                            ))}
                                        </select>
                                        <select 
                                            id="startYear"
                                            value={formData.startYear}
                                            onChange={handleChange}
                                            className="flex-1 px-3 py-2 border text-sm border-gray-300 rounded"
                                        >
                                            <option value="">Year</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label>End Date</Label>
                                    <div className="flex gap-2">
                                        <select 
                                            id="endMonth"
                                            value={formData.endMonth}
                                            onChange={handleChange}
                                            disabled={formData.currentlyWorking}
                                            className="flex-1 px-3 py-2 border text-sm border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Month</option>
                                            {months.map(month => (
                                                <option key={month} value={month}>{month}</option>
                                            ))}
                                        </select>
                                        <select 
                                            id="endYear"
                                            value={formData.endYear}
                                            onChange={handleChange}
                                            disabled={formData.currentlyWorking}
                                            className="flex-1 px-3 py-2 border text-sm border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Year</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
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
                            <Button className="cursor-pointer mt-6" type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddExperience;
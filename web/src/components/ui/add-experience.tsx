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

const AddExperience = () => {
    return (
        <div>
            <Dialog>
                <form>
                    <DialogTrigger asChild>
                        <Button className="cursor-pointer hover-lift text-base p-5">Add Experience</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">Add New Experience</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" placeholder="e.g. Software Engineer" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="organization">Organization</Label>
                                <Input id="organization" placeholder="e.g. Google" />
                            </div>
                            <div className="flex flex-row justify-between gap-4">
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="start">Start Date</Label>
                                    <Input id="start" placeholder="e.g. January 2020" />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="end">End Date</Label>
                                    <Input id="end" placeholder="e.g. December 2021 or Present" />
                                </div>
                            </div>
                            
                            <div className="grid gap-3">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Brief description of your role and achievements" />
                            </div>
        
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button className="cursor-pointer" type="submit">Save</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </form>
                
            </Dialog>
        </div>
    );
};

export default AddExperience;
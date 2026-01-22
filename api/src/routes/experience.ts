import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { validate } from "../validators/validate";
import { experienceSchema } from "../validators/schema";

const experienceRouter = Router();

experienceRouter.post("/", validate(experienceSchema), async (req, res) => {
    const { title, organization, startDate, endDate, description } = req.body;
    console.log(req.body);


    const userId = Number(req.session.userId);
    console.log("session.userId:", req.session.userId, typeof req.session.userId);

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    try {
        
        const newExperience = await prisma.experience.create({
            data: {
                userId,
                title,
                organization,
                startDate,
                endDate,
                description,
            }
        });
        return res.status(201).json(newExperience);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }

});


experienceRouter.patch("/:experienceId", validate(experienceSchema), async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const experienceId = Number(req.params.experienceId);
    if (isNaN(experienceId)) {
        return res.status(400).json({
            message: "Invalid experience ID"
        });
    }

    const experience = await prisma.experience.findUnique({
        where  : { id: experienceId }
    });
    if (!experience || experience.userId !== userId) {
        return res.status(404).json({
            message: "Experience not found"
        });
    }
    const { title, organization, startDate, endDate, description } = req.body;
    try {
        const updatedExperience = await prisma.experience.update({
            where: { id: experienceId },
            data: {
                title,
                organization,
                startDate,
                endDate,
                description,
            },
        });
        return res.status(200).json(updatedExperience);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

experienceRouter.delete("/:experienceId", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const experienceId = Number(req.params.experienceId);
    if (isNaN(experienceId)) {
        return res.status(400).json({
            message: "Invalid experience ID"
        });
    }
    const experience = await prisma.experience.findUnique({
        where  : { id: experienceId }
    });
    if (!experience || experience.userId !== userId) {
        return res.status(404).json({
            message: "Experience not found"
        });
    }
    try {
        await prisma.experience.delete({
            where: { id: experienceId }
        });
        return res.status(200).json({
            message: "Experience deleted"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});
export default experienceRouter;
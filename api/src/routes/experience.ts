import { Router } from "express";
import { prisma } from "../../lib/prisma";

const experienceRouter = Router();

experienceRouter.post("/profile", async (req, res) => {
    const userId = req.body.userId;
    const { title, organization, startDate, endDate, description } = req.body;
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
        return res.status(500).json({
            message: "Internal server error"
        });
    }

});

export default experienceRouter;
import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { validate } from "../validators/validate";
import { profileUpdateSchema } from "../validators/schema";

const profileRouter = Router();


profileRouter.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,    
                lastName: true,
                email: true,
                major: true,
                graduationYear: true,
            }
        });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }   
});


profileRouter.get("/users/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId},
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                major: true,
                graduationYear: true,
                experiences: true,
            }
        });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }

});

profileRouter.patch("/me", validate(profileUpdateSchema), async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const { major, graduationYear } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { major, graduationYear },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                major: true,
                graduationYear: true,
                experiences: true,
            }
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default profileRouter;

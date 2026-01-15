import { Router } from "express";
import { prisma } from "../../lib/prisma";

const profileRouter = Router();


profileRouter.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,    
                lastName: true,
                email: true,
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
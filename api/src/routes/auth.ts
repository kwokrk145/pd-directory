import { Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

const router = Router();

router.post("/register", async (req, res) => {
    // Registration logic here
    const { firstName, lastName, email, password } = req.body;

    // validation code goes here
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                passwordHash,
            },
        });
        return res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
        
    


});


export default router;
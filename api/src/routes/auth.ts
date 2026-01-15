import { Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { validate } from "../validators/validate";
import { registerSchema, loginSchema } from "../validators/schema";

const router = Router();

router.post("/register", validate(registerSchema), async (req, res) => {
    // Registration logic here
    const { firstName, lastName, email, password } = req.body;

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
        return res.status(500).json({ 
            message: "Internal server error" 
        });
    }
        
});

router.post("/login", validate(loginSchema), async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (!existingUser) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const validPassword = await bcrypt.compare(password, existingUser.passwordHash);
        if (!validPassword) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }
        return res.status(200).json({
            id: existingUser.id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Internal server error"
        });
    } 

});


export default router;
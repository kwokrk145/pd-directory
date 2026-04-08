import { Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { validate } from "../validators/validate";
import { registerSchema, loginSchema } from "../validators/schema";

const router = Router();

router.post("/register", validate(registerSchema), async (req, res) => {
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

        req.session.userId = newUser.id;

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
            include: { experiences: true }
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

        req.session.userId = existingUser.id;

        return res.status(200).json({
            id: existingUser.id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            experiences: existingUser.experiences,
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Internal server error"
        });
    } 

});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }

    res.clearCookie("pd.sid"); // same name as session cookie as shown in app.ts

    return res.status(200).json({ message: "Logged out" });
  });
});


router.get("/me", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
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
    



export default router;
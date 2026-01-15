import type { ZodType } from "zod";
import { Request, Response, NextFunction } from 'express';

export const validate = 
    <T>(schema: ZodType<T>) => (req: Request, res: Response, next: NextFunction) => {
        // validate data
        const result = schema.safeParse(req.body);
        
        // return error if not
        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten()
            });
        }

        // proceed if valid
        req.body = result.data;
        next();
    }
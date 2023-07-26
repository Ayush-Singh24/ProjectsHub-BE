import express, { Router, Request, Response, NextFunction } from "express";
import { createUser } from "services/authService";
import { userDetails } from "utils/types";
import { signUpSchema } from "utils/zodSchemas";

export const authRouter: Router = express.Router();

authRouter.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = signUpSchema.parse(req.body);
      await createUser({ username, email, password });
      res.status(201).send({ message: "Successfully signed up" });
    } catch (error) {
      next(error);
    }
  }
);

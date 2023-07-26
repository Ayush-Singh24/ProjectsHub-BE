import express, { Router, Request, Response, NextFunction } from "express";
import { createUser, loginUser } from "../services/authService";
import { loginSchema, signUpSchema } from "../utils/zodSchemas";

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

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.session.isAuth = true;
      const { username, password } = loginSchema.parse(req.body);
      await loginUser({ username, password });
      res.status(200).send({ message: "Logged in" });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.session.destroy(() => {
        res.status(200).send({ message: "Logged out" });
      });
    } catch (error) {
      next(error);
    }
  }
);

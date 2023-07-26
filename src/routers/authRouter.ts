import express, { Router, Request, Response, NextFunction } from "express";

export const authRouter: Router = express.Router();

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(400).send("not authorized");
    } catch (error) {
      console.log(error);
    }
  }
);

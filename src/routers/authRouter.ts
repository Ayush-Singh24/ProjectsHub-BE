import express, { Router, Request, Response, NextFunction } from "express";

const authRouter: Router = express.Router();

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName } = req.body;
      if (userName === "hello") {
        res.status(200).send("logged in");
      }
      res.status(400).send("not authorized");
    } catch (error) {
      console.log(error);
    }
  }
);

import express, { Express, Request, Response } from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

import { config } from "dotenv";
config();

import cors from "cors";

export const prisma = new PrismaClient();

const PORT = process.env.PORT || 8000;
const app: Express = express();

declare module "express-session" {
  interface SessionData {
    user: string;
  }
}

app.use(
  cors({
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdFunction: undefined,
      dbRecordIdIsSessionId: true,
    }),
  })
);

app.get("/", (req: Request, res: Response) => {
  req.session.user = "hello";
  console.log(req.session);
  res.status(200).send("hello world");
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}⚡`);
});

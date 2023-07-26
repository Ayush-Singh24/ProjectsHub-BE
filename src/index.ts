import express, { Express, Request, Response } from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

import { config } from "dotenv";
config();

import cors from "cors";
import { authRouter } from "routers/authRouter";
import { errorHandeler } from "utils/errorHandler";

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

app.use("/auth", authRouter);
app.use(errorHandeler);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}⚡`);
});

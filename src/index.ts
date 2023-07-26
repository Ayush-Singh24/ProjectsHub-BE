import express, { Express, json } from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

import { config } from "dotenv";
config();

import cors from "cors";
import { authRouter } from "./routers/authRouter";
import { errorHandler } from "./utils/errorHandler";

export const prisma = new PrismaClient();

const PORT = process.env.PORT || 8000;
const app: Express = express();

declare module "express-session" {
  interface SessionData {
    isAuth: boolean;
  }
}

app.use(
  cors({
    credentials: true,
  })
);

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdFunction: undefined,
      dbRecordIdIsSessionId: true,
    }),
  })
);

app.use(json());

app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}⚡`);
});

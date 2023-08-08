import express, { Express, Request, Response, json } from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

import { config } from "dotenv";
config();

import cors, { CorsOptions } from "cors";
import { authRouter } from "./routers/authRouter";
import { errorHandler } from "./utils/errorHandler";

export const prisma = new PrismaClient();

const PORT = process.env.PORT || 8000;
const app: Express = express();

declare module "express-session" {
  interface SessionData {
    username: string;
  }
}

const whiteList = ["http://localhost:8000"];
const corsOptions: CorsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (whiteList.indexOf(origin) === -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
};

app.use(cors(corsOptions));

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

app.get("/", async (req: Request, res: Response) => {
  if (req.session.username) {
    return res.status(200).send({ username: req.session.username });
  }
  return res.status(401).send({ message: "not authorised" });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}⚡`);
});

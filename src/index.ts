import express, { Express, Request, Response, json } from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

import { config } from "dotenv";
config();

import cors, { CorsOptions } from "cors";
import { authRouter } from "./routers/authRouter";
import { errorHandler } from "./utils/errorHandler";
import { verifySession } from "./middlewares/verifySession";

export const prisma = new PrismaClient();

const PORT = process.env.PORT || 8000;
const app: Express = express();

declare module "express-session" {
  interface SessionData {
    username: string;
  }
}

const whitelist = ["http://localhost:3000", "http://localhost:8000"];
const corsOptions: cors.CorsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
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

app.get("/", verifySession, (req: Request, res: Response) => {
  console.log("request made \n" + req);
  res.send({});
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}⚡`);
});

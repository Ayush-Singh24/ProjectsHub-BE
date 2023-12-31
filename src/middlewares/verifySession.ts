import { prisma } from "..";
import { Request, Response, NextFunction } from "express";

export const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await prisma.session.findUnique({
      where: {
        sid: req.session.id,
      },
    });

    if (!session) {
      throw new Error("Not Authorized");
    }

    next();
  } catch (error: any) {
    res.status(401).send({ message: error.message });
  }
};

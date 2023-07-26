import { prisma } from "index";
import { GeneralError } from "utils/generalError";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/constants";

interface userDetails {
  username: string;
  email: string;
  password: string;
}

export const creatUser = async ({ username, email, password }: userDetails) => {
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username,
        },
        {
          email,
        },
      ],
    },
  });

  if (user) {
    throw new GeneralError(409, "Email or Username already exists");
  }

  const hasedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  user = await prisma.user.create({
    data: {
      username,
      email,
      password: hasedPassword,
    },
  });

  return user.username;
};

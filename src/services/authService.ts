import { prisma } from "../index";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/constants";
import { userDetails } from "../utils/types";
import { GeneralError } from "../utils/generalError";

export const createUser = async ({
  username,
  email,
  password,
}: userDetails) => {
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

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return user.username;
};

export const loginUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new GeneralError(404, "Username does not exist");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new GeneralError(401, "Incorrect password");
  }

  return user.username;
};

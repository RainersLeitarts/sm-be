import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  modifyRefreshToken,
} from "../models/users";
import bcrypt from "bcrypt";
import { generateNewTokens } from "../utils/auth";
import { AuthErrors } from "../middleware/globalErrorHandler";

export async function registerUserService(
  email: string,
  username: string,
  password: string
) {
  const isEmailTaken = await findUserByEmail(email);

  if (isEmailTaken) {
    throw new Error(AuthErrors.EMAIL_TAKEN);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  await createUser({ username, email, password: hashedPass });

  const { accessToken, refreshToken } = generateNewTokens(email, username);

  await modifyRefreshToken(email, refreshToken);

  return { accessToken, refreshToken };
}

export async function loginUserService(username: string, password: string) {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error(AuthErrors.USERNAME_NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error(AuthErrors.INCORRECT_PASSWORD);
  }

  const { accessToken, refreshToken } = generateNewTokens(
    user.email,
    user.username
  );

  await modifyRefreshToken(user.email, refreshToken);

  return { accessToken, refreshToken };
}

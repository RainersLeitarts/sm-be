import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  modifyRefreshToken,
} from "../models/users";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateNewTokens } from "../utils/auth";
import { AuthErrors } from "../middleware/globalErrorHandler";
import { TokenPayload } from "../types/auth";

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

export async function refreshTokenService(reqRefreshToken: string) {
  const isValid = jwt.verify(reqRefreshToken, process.env.JWT_REFRESH_SECRET!);

  if (!isValid) {
    throw new Error(AuthErrors.INVALID_REFRESH_TOKEN);
  }

  const JWTData = jwt.decode(reqRefreshToken) as
    | (JwtPayload & TokenPayload)
    | null;

  if (JWTData === null) {
    throw new Error(AuthErrors.INVALID_REFRESH_TOKEN);
  }

  const user = await findUserByUsername(JWTData.username);

  if (!user) {
    throw new Error(AuthErrors.USERNAME_NOT_FOUND);
  }

  if (user.refreshToken !== reqRefreshToken) {
    throw new Error(AuthErrors.INVALID_REFRESH_TOKEN);
  }

  const { accessToken, refreshToken } = generateNewTokens(
    user.email,
    user.username
  );

  await modifyRefreshToken(user.email, refreshToken);

  return { accessToken, refreshToken };
}

export async function logoutService(reqRefreshToken: string) {
  const isValid = jwt.verify(reqRefreshToken, process.env.JWT_REFRESH_SECRET!);

  if (!isValid) {
    throw new Error(AuthErrors.INVALID_REFRESH_TOKEN);
  }

  const username = (isValid as JwtPayload & TokenPayload).username;
  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error(AuthErrors.USERNAME_NOT_FOUND);
  }

  if (user.refreshToken !== reqRefreshToken) {
    throw new Error(AuthErrors.INVALID_REFRESH_TOKEN);
  }

  await modifyRefreshToken(user.email, null);
}

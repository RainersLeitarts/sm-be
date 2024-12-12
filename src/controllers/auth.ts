import { NextFunction, Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  modifyRefreshToken,
} from "../models/users";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateNewTokens } from "../utils/auth";
import { TokenPayload } from "../types/auth";
import { loginUserService, registerUserService } from "../services/auth";

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(400).json({ message: "Invalid or missing credentials" });
    return;
  }

  try {
    const { accessToken, refreshToken } = await registerUserService(
      email,
      username,
      password
    );

    res
      .status(201)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: false })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
      .json({ message: "User registered" });
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Invalid or missing credentials" });
    return;
  }

  try {
    const { accessToken, refreshToken } = await loginUserService(
      username,
      password
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: false })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
      .json({ message: "User authenticated" });
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenController(req: Request, res: Response) {
  const reqRefreshToken = req.cookies.refreshToken;

  const isValid = jwt.verify(reqRefreshToken, process.env.JWT_REFRESH_SECRET!);

  if (!isValid) {
    res.status(400).json({ message: "Invalid refresh token" });
    return;
  }

  const JWTData = jwt.decode(reqRefreshToken) as
    | (JwtPayload & TokenPayload)
    | null;

  if (JWTData === null) {
    res.status(400).json({ message: "Invalid refresh token" });
    return;
  }

  const user = await findUserByUsername(JWTData.username);

  if (user.refreshToken !== reqRefreshToken) {
    res.status(400).json({ message: "Invalid refresh token" });
    return;
  }

  const { accessToken, refreshToken } = generateNewTokens(
    user.email,
    user.username
  );

  await modifyRefreshToken(user.email, refreshToken);

  res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: false })
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
    .json({ message: "Token refreshed" });
}

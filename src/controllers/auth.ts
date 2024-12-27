import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { findUserByUsername, modifyRefreshToken } from "../models/users";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateNewTokens } from "../utils/auth";
import { TokenPayload } from "../types/auth";
import {
  loginUserService,
  logoutService,
  refreshTokenService,
  registerUserService,
} from "../services/auth";
import { AuthErrors } from "../middleware/globalErrorHandler";

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, username, password } = req.body;

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
      .json({ status: "success" });
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

  try {
    const { accessToken, refreshToken } = await loginUserService(
      username,
      password
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
      })
      .json({ status: "success", data: { username } });
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reqRefreshToken = req.cookies.refreshToken;

    if (!reqRefreshToken) {
      throw new Error(AuthErrors.NO_REFRESH_TOKEN);
    }

    const { accessToken, refreshToken } = await refreshTokenService(
      reqRefreshToken
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: false })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
      .json({ status: "success" });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reqRefreshToken = req.cookies.refreshToken;

    if (!reqRefreshToken) {
      throw new Error(AuthErrors.NO_REFRESH_TOKEN);
    }

    await logoutService(reqRefreshToken);

    res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ status: "success" });
  } catch (error) {
    next(error);
  }
}

export async function checkController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(200).json({ status: "success" });
}

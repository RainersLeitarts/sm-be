import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthErrors } from "./globalErrorHandler";

export async function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    next(new Error(AuthErrors.NO_ACCESS_TOKEN));
    return;
  }

  const isValid = jwt.verify(accessToken, process.env.JWT_SECRET!);

  if (!isValid) {
    next(new Error(AuthErrors.INVALID_ACCESS_TOKEN));
    return;
  }

  next();
}

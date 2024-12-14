import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { AuthErrors } from "./globalErrorHandler";
import { TokenPayload } from "../types/auth";

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

  jwt.verify(accessToken, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if(err instanceof TokenExpiredError){
      next(new Error(AuthErrors.ACCESS_TOKEN_EXPIRED))
      return
    }

    decoded as TokenPayload;

    if (!decoded) {
      next(new Error(AuthErrors.INVALID_ACCESS_TOKEN));
      return;
    }

    req.headers["x-username"] = decoded.username;
    next();
  });
}

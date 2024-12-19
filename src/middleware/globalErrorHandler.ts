import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO: Implement and use a logger middleware here
  console.log("Error:", err.message);

  if (err.message in AuthErrors) {
    const { code, message } =
      AuthErrorInfo[err.message as keyof typeof AuthErrorInfo];

    res.status(code).json({ message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ message: "Validation failed", errors: err.errors });
    return;
  }

  res.status(500).json({ message: err.message });
}

export enum AuthErrors {
  "EMAIL_TAKEN" = "EMAIL_TAKEN",
  "USERNAME_NOT_FOUND" = "USERNAME_NOT_FOUND",
  "INCORRECT_PASSWORD" = "INCORRECT_PASSWORD",
  "NO_ACCESS_TOKEN" = "NO_ACCESS_TOKEN",
  "INVALID_ACCESS_TOKEN" = "INVALID_ACCESS_TOKEN",
  "ACCESS_TOKEN_EXPIRED" = "ACCESS_TOKEN_EXPIRED",
}

export const AuthErrorInfo: Record<AuthErrors, { message: string; code: number }> = {
  [AuthErrors.EMAIL_TAKEN]: {
    message: "User with this email already exists",
    code: 400,
  },
  [AuthErrors.USERNAME_NOT_FOUND]: {
    message: "Username not found",
    code: 404,
  },
  [AuthErrors.INCORRECT_PASSWORD]: {
    message: "Incorrect password",
    code: 401,
  },
  [AuthErrors.NO_ACCESS_TOKEN]: {
    message: "No access token provided",
    code: 403,
  },
  [AuthErrors.INVALID_ACCESS_TOKEN]: {
    message: "Invalid access token",
    code: 401,
  },
  [AuthErrors.ACCESS_TOKEN_EXPIRED]: {
    message: "Access token expired",
    code: 401,
  },
};

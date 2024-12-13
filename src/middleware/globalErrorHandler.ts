import { NextFunction, Request, Response } from "express";

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

  res.status(500).json({ message: "Unexpected error" });
}

export enum AuthErrors {
  "EMAIL_TAKEN" = "EMAIL_TAKEN",
  "USERNAME_NOT_FOUND" = "USERNAME_NOT_FOUND",
  "INCORRECT_PASSWORD" = "INCORRECT_PASSWORD",
}

const AuthErrorInfo: Record<AuthErrors, { message: string; code: number }> = {
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
};

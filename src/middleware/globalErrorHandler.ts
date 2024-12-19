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

  const specifiedErrorInfo = getSpecifiedErrorInfo(
    err,
    AuthErrorInfo,
    PostErrorInfo
  );

  if (specifiedErrorInfo) {
    res
      .status(specifiedErrorInfo.code)
      .json({ message: specifiedErrorInfo.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ message: "Validation failed", errors: err.errors });
    return;
  }

  res.status(500).json({ message: err.message });
}

function getSpecifiedErrorInfo(
  err: Error,
  ...args: (typeof AuthErrorInfo | typeof PostErrorInfo)[]
): { message: string; code: number } | undefined {
  const errorInfo = args.find((errCollection) => {
    if (err.message in errCollection) {
      return errCollection;
    }
  });

  if (!errorInfo) return;

  return errorInfo[err.message as keyof typeof errorInfo];
}

export enum AuthErrors {
  "EMAIL_TAKEN" = "EMAIL_TAKEN",
  "USERNAME_NOT_FOUND" = "USERNAME_NOT_FOUND",
  "INCORRECT_PASSWORD" = "INCORRECT_PASSWORD",
  "NO_ACCESS_TOKEN" = "NO_ACCESS_TOKEN",
  "INVALID_ACCESS_TOKEN" = "INVALID_ACCESS_TOKEN",
  "ACCESS_TOKEN_EXPIRED" = "ACCESS_TOKEN_EXPIRED",
}

export const AuthErrorInfo: Record<
  AuthErrors,
  { message: string; code: number }
> = {
  [AuthErrors.EMAIL_TAKEN]: {
    message: "User with this email already exists",
    code: 400,
  },
  // move this to "UserErrors"
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

export enum PostErrors {
  "POST_NOT_FOUND" = "POST_NOT_FOUND",
  "POST_NOT_OWNED_BY_USER" = "POST_NOT_OWNED_BY_USER",
}

export const PostErrorInfo: Record<
  PostErrors,
  { message: string; code: number }
> = {
  [PostErrors.POST_NOT_FOUND]: {
    message: "Post not found",
    code: 404,
  },
  [PostErrors.POST_NOT_OWNED_BY_USER]: {
    message: "You don't own this post",
    code: 403,
  },
};

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
    res.status(specifiedErrorInfo.code).json({
      status: "fail",
      message: specifiedErrorInfo.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      status: "fail",
      data: {
        errors: err.errors.map((error) => ({
          field: error.path[0],
          message: error.message,
        })),
      },
    });
    return;
  }

  res.status(500).json({ status: "error", message: err.message });
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
  "ACCESS_TOKEN_EXPIRED" = "ACCESS_TOKEN_EXPIRED",
  "INVALID_ACCESS_TOKEN" = "INVALID_ACCESS_TOKEN",
  "NO_REFRESH_TOKEN" = "NO_REFRESH_TOKEN",
  "INVALID_REFRESH_TOKEN" = "INVALID_REFRESH_TOKEN",
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
  [AuthErrors.INVALID_REFRESH_TOKEN]: {
    message: "Invalid refresh token",
    code: 400,
  },
  [AuthErrors.NO_REFRESH_TOKEN]: {
    message: "No refresh token provided",
    code: 403,
  },
};

export enum PostErrors {
  "POST_NOT_FOUND" = "POST_NOT_FOUND",
  "POST_NOT_OWNED_BY_USER" = "POST_NOT_OWNED_BY_USER",
}

export const PostErrorInfo: Record<
  PostErrors,
  { status: "fail"; message: string; code: number }
> = {
  [PostErrors.POST_NOT_FOUND]: {
    status: "fail",
    message: "Post not found",
    code: 404,
  },
  [PostErrors.POST_NOT_OWNED_BY_USER]: {
    status: "fail",
    message: "You don't own this post",
    code: 403,
  },
};

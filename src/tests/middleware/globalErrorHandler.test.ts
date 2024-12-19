import request from "supertest";
import express, { NextFunction, Request, Response } from "express";
import {
  AuthErrorInfo,
  AuthErrors,
  globalErrorHandler,
} from "../../middleware/globalErrorHandler";

describe("Global error handling middleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();

    app.post(
      "/api/auth/login",
      (req: Request, res: Response, next: NextFunction) => {
        const error = new Error(AuthErrors.INCORRECT_PASSWORD);
        next(error);
      }
    );

    app.post(
      "/api/auth/other",
      (req: Request, res: Response, next: NextFunction) => {
        const error = new Error("Unspecified error");
        next(error);
      }
    );

    app.use(globalErrorHandler);
  });

  it("Should handle an auth error, for example, INCORRECT_PASSWORD", async () => {
    const response = await request(app).post("/api/auth/login");

    expect(response.status).toBe(
      AuthErrorInfo[AuthErrors.INCORRECT_PASSWORD].code
    );
    expect(response.body).toEqual({
      message: AuthErrorInfo[AuthErrors.INCORRECT_PASSWORD].message,
    });
  });

  it("Should handle an error that is not specified", async () => {
    const response = await request(app).post("/api/auth/other");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Unspecified error",
    });
  });
});

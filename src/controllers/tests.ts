import { NextFunction, Request, Response } from "express";
import { throwError } from "../services/tests";
import { AuthErrors } from "../middleware/globalErrorHandler";

export function throwErrorController(req: Request, res: Response, next: NextFunction) {
    try {
        throwError(AuthErrors.EMAIL_TAKEN)
    } catch (error) {
        next(error)
    }
}
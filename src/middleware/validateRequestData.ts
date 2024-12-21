import { NextFunction, Request, Response } from "express";

export function validateRequestData(schema: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse({ ...req.body, ...req.query });
      next();
    } catch (error) {
      next(error);
    }
  };
}

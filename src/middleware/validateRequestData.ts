import { NextFunction, Request, Response } from "express";

export function validateRequestData(schema: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse(req.body);
      next()
    } catch (error) {
        next(error)
    }
  };
}

import { NextFunction, Request, Response } from "express";
import { createPostService, editPostService } from "../services/posts";

export async function createPostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { textContent } = req.body;
    const username = req.headers["x-username"] as string;

    await createPostService(username, textContent);

    res.status(201).json({ message: "Post created" });
  } catch (error) {
    next(error);
  }
}

export async function editPostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { postId, textContent } = req.body;
    const username = req.headers["x-username"] as string;

    await editPostService(username, postId, textContent);

    res.status(201).json({ message: "Post created" });
  } catch (error) {
    next(error);
  }
}

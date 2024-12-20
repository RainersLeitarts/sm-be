import { NextFunction, Request, Response } from "express";
import {
  createPostService,
  deletePostService,
  editPostService,
  getPostsService,
} from "../services/posts";

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
  const { postId, textContent } = req.body;
  const username = req.headers["x-username"] as string;

  try {
    await editPostService(username, postId, textContent);

    res.status(201).json({ message: "Post created" });
  } catch (error) {
    next(error);
  }
}

export async function deletePostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { postId } = req.body;
  const username = req.headers["x-username"] as string;

  try {
    await deletePostService(username, postId);

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
}

export async function getPostsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const posts = await getPostsService();

  res.status(200).json(posts);
}

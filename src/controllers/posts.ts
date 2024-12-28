import { NextFunction, Request, Response } from "express";
import {
  createCommentService,
  createPostService,
  deleteCommentService,
  deletePostService,
  editPostService,
  getPostService,
  getPostsService,
  toggleLikeService,
  updateCommentService,
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
  const { id } = req.params;
  const { textContent } = req.body;
  const username = req.headers["x-username"] as string;

  try {
    await editPostService(username, id as string, textContent);

    res.status(201).json({ message: "Post edited" });
  } catch (error) {
    next(error);
  }
}

export async function deletePostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const username = req.headers["x-username"] as string;

  try {
    await deletePostService(username, id as string);

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
  try {
    const posts = await getPostsService();

    res.status(200).json({ status: "success", data: posts });
  } catch (error) {
    next(error);
  }
}

export async function getPostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  try {
    const post = await getPostService(id as string);

    console.log("post:", post);

    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    next(error);
  }
}

export async function toggleLikeController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const username = req.headers["x-username"] as string;

  try {
    const likeId = await toggleLikeService(username, id);

    res
      .status(likeId ? 201 : 200)
      .json({ status: "success", data: { likeId } });
  } catch (error) {
    next(error);
  }
}

export async function createCommentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { textContent, parentId } = req.body;
  const username = req.headers["x-username"] as string;

  try {
    await createCommentService(username, id, textContent, parentId);

    res.status(201).json({ status: "success", message: "Comment created" });
  } catch (error) {
    next(error);
  }
}

export async function updateCommentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { commentId } = req.params;
  const { textContent } = req.body;
  const username = req.headers["x-username"] as string;

  console.log(commentId);

  try {
    await updateCommentService(username, commentId, textContent);

    res.status(200).json({ status: "success", message: "Comment updated" });
  } catch (error) {
    next(error);
  }
}

export async function deleteCommentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { commentId } = req.params;
  const username = req.headers["x-username"] as string;

  try {
    await deleteCommentService(username, commentId);

    res.status(200).json({ status: "success", message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
}

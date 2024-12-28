import { z } from "zod";

export const editPostSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID" }),
});

export const deletePostSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID" }),
});

export const getPostSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID" }),
});

export const likePostSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID" }),
});

export const createCommentSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID" }),
  textContent: z.string().min(1, { message: "Content is required" }),
  parentId: z.string().uuid({ message: "Invalid UUID" }).optional(),
});

export const updateCommentSchema = z.object({
  commentId: z.string().uuid({ message: "Invalid UUID" }),
  textContent: z.string().min(1, { message: "Content is required" }),
});

export const deleteCommentSchema = z.object({
  commentId: z.string().uuid({ message: "Invalid UUID" }),
});

export const getPostCommentsSchema = z.object({
  postId: z.string().uuid({ message: "Invalid UUID" }),
});
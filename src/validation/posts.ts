import { z } from "zod";

export const editPostSchema = z.object({
  id: z.string().uuid({message: "Invalid UUID"}),
});

export const deletePostSchema = z.object({
  id: z.string().uuid({message: "Invalid UUID"}),
});

export const getPostSchema = z.object({
  id: z.string().uuid({message: "Invalid UUID"}),
});

export const likePostSchema = z.object({
  id: z.string().uuid({message: "Invalid UUID"}),
});
import { z } from "zod";

export const editPostSchema = z.object({
  postId: z.string().uuid({message: "Invalid UUID"}),
});


export const deletePostSchema = z.object({
  postId: z.string().uuid({message: "Invalid UUID"}),
});

import { z } from "zod";

export const getPostsSchema = z.object({
  after: z
    .string()
    .refine(
      (value) => {
        const ISO8601Regex = new RegExp(
          /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/
        );
        return ISO8601Regex.test(value);
      },
      { message: "After parameter must be of ISO 8601 format" }
    )
    .optional(),
  limit: z
    .string()
    .refine(
      (value) => {
        return !isNaN(Number(value));
      },
      { message: "Limit must be a number" }
    )
    .transform((value) => Number(value))
    .refine(
      (value) => {
        return value >= 1;
      },
      { message: "Minimum limit is 1" }
    )
    .refine(
      (value) => {
        return value <= 50;
      },
      { message: "Maximum limit is 50" }
    )
    .optional(),
});

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

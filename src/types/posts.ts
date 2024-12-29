import { commentsTable } from "../db/schema";

export type Comment = typeof commentsTable.$inferInsert;

export type MappedComment = Comment & {
  children: MappedComment[];
};

export type CommentsMap = Map<string, MappedComment>;

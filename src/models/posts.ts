import db from "../db";
import { postsTable } from "../db/schema";

export async function createPost({ textContent, authorId }: { textContent: string, authorId: string }) {
  const post: typeof postsTable.$inferInsert = {
    textContent,
    authorId
  };

  await db.insert(postsTable).values(post);
}

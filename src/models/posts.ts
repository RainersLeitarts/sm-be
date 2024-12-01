import db from "../db";
import { postsTable } from "../db/schema";

export async function createPost({ textContent }: { textContent: string }) {
  const post: typeof postsTable.$inferInsert = {
    textContent,
  };

  await db.insert(postsTable).values(post);
}

import { and, eq } from "drizzle-orm";
import db from "../db";
import { likesTable, postsTable } from "../db/schema";

export async function createPost({
  textContent,
  authorId,
}: {
  textContent: string;
  authorId: string;
}) {
  const post: typeof postsTable.$inferInsert = {
    textContent,
    authorId,
  };

  await db.insert(postsTable).values(post);
}

export async function getPosts() {
  const res = await db.query.postsTable.findMany({
    with: {
      author: {
        columns: {
          username: true,
        },
      },
    },
  });
  return res;
}

export async function getPostById(id: string) {
  const res = await db.select().from(postsTable).where(eq(postsTable.id, id));
  return res?.[0];
}

export async function updatePost(id: string, textContent: string) {
  const res = await db
    .update(postsTable)
    .set({ textContent, isEdited: true })
    .where(eq(postsTable.id, id));

  return res;
}

export async function deletePost(id: string) {
  const res = await db.delete(postsTable).where(eq(postsTable.id, id));

  return res;
}

export async function likePost(authorId: string, postId: string) {
  const res = await db
    .insert(likesTable)
    .values({ authorId, postId })
    .returning({ id: likesTable.id });

  return res?.[0].id;
}

export async function findLike(authorId: string, postId: string) {
  const res = await db
    .select()
    .from(likesTable)
    .where(
      and(eq(likesTable.authorId, authorId), eq(likesTable.postId, postId))
    );

  return res?.[0];
}

export async function deleteLike(likeId: string) {
  await db.delete(likesTable).where(eq(likesTable.id, likeId));
}

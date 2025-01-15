import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import db from "../db";
import { commentsTable, likesTable, postsTable } from "../db/schema";

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

  const res = await db
    .insert(postsTable)
    .values(post)
    .returning({ id: postsTable.id });

  return res?.[0];
}

export async function getPosts(limit: number, before?: string) {
  const res = await db.query.postsTable.findMany({
    where: before ? lt(postsTable.createdAt, new Date(before)) : undefined,
    limit,
    with: {
      author: {
        columns: {
          username: true,
        },
      },
      media: {
        columns: {
          publicUrl: true,
        },
      },
    },
    orderBy: [desc(postsTable.createdAt)],
  });
  return res;
}

export async function getPostById(id: string) {
  const res = await db.query.postsTable.findFirst({
    where: eq(postsTable.id, id),
    with: {
      author: {
        columns: {
          username: true,
        },
      },
      media: {
        columns: {
          publicUrl: true,
        },
      },
    },
  });

  return res;
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

export async function createComment(
  authorId: string,
  postId: string,
  textContent: string,
  parentId?: string
) {
  await db
    .insert(commentsTable)
    .values({ authorId, postId, textContent, parentId });
}

export async function getComment(id: string) {
  const res = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.id, id));

  return res?.[0];
}

export async function getPostComments(postId: string) {
  const res = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postId, postId));

  return res;
}

export async function updateComment(id: string, textContent: string) {
  await db
    .update(commentsTable)
    .set({ textContent })
    .where(eq(commentsTable.id, id));
}

export async function deleteComment(id: string) {
  await db.delete(commentsTable).where(eq(commentsTable.id, id));
}

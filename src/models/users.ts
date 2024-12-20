import { eq } from "drizzle-orm";
import db from "../db";
import { usersTable } from "../db/schema";

export async function createUser(user: typeof usersTable.$inferInsert) {
  await db.insert(usersTable).values(user);
}

export async function modifyRefreshToken(email: string, refreshToken: string | null) {
  await db
    .update(usersTable)
    .set({ refreshToken })
    .where(eq(usersTable.email, email));
}

export async function findUserByEmail(email: string) {
  const res = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return res?.[0];
}

export async function findUserByUsername(username: string) {
  const res = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  return res?.[0];
}

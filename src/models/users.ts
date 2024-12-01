import { eq } from "drizzle-orm";
import db from "../db";
import { usersTable } from "../db/schema";

export async function createUser(user: typeof usersTable.$inferInsert) {
  await db.insert(usersTable).values(user);
}

export async function modifyRefreshToken(email: string, refreshToken: string) {
  await db
    .update(usersTable)
    .set({ refreshToken })
    .where(eq(usersTable.email, email));
}

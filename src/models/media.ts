import db from "../db";
import { mediaTable } from "../db/schema";

export async function createMedia(media: typeof mediaTable.$inferInsert[]) {
    await db.insert(mediaTable).values(media)
}

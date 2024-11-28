import db from "../db/index";

export async function createPost() {
  await db.connect();
    const res = await db.query("INSERT INTO posts (textcontent) VALUES ($1) RETURNING *", ["Hello 7abibi"])
    console.log(res.rows[0]);
  try {
  } catch (error) {
    console.log(error);
  } finally {
    await db.end();
  }
}

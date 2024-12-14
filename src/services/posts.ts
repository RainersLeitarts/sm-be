import { createPost } from "../models/posts";
import { findUserByUsername } from "../models/users";

export async function createPostService(authorUsername: string, textContent: string) {
    const user = await findUserByUsername(authorUsername)

    if(!user){
        throw new Error("USER_NOT_FOUND")
    }

    await createPost({ textContent, authorId: user.id });
}
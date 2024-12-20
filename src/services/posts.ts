import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../models/posts";
import { findUserByUsername } from "../models/users";

export async function createPostService(
  authorUsername: string,
  textContent: string
) {
  const user = await findUserByUsername(authorUsername);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  await createPost({ textContent, authorId: user.id });
}

export async function getPostsService() {
  return await getPosts()
}

export async function editPostService(
  username: string,
  postId: string,
  textContent: string
) {
  const post = await getPostById(postId);

  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (post.authorId !== user.id) {
    throw new Error("POST_NOT_OWNED_BY_USER");
  }

  await updatePost(post.id, textContent);
}

export async function deletePostService(username: string, postId: string) {
  const post = await getPostById(postId);

  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (post.authorId !== user.id) {
    throw new Error("POST_NOT_OWNED_BY_USER");
  }

  await deletePost(postId);
}

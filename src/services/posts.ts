import { PostErrors } from "../middleware/globalErrorHandler";
import {
  createComment,
  createPost,
  deleteComment,
  deleteLike,
  deletePost,
  findLike,
  getComment,
  getPostById,
  getPostComments,
  getPosts,
  likePost,
  updateComment,
  updatePost,
} from "../models/posts";
import { findUserByUsername } from "../models/users";
import { CommentsMap, MappedComment } from "../types/posts";

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

export async function getPostsService(limit: number, before?: string) {
  console.log("after:", before);
  const posts = await getPosts(limit, before);

  const next = posts.length > 0 ? posts[posts.length - 1].createdAt : null;

  return { posts, next };
}

export async function getPostService(id: string) {
  const post = await getPostById(id);

  if (!post) {
    throw new Error(PostErrors.POST_NOT_FOUND);
  }

  return post;
}

export async function editPostService(
  username: string,
  postId: string,
  textContent: string
) {
  const post = await getPostById(postId);

  if (!post) {
    throw new Error(PostErrors.POST_NOT_FOUND);
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

export async function toggleLikeService(username: string, postId: string) {
  const post = await getPostById(postId);

  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const like = await findLike(user.id, post.id);

  if (like) {
    await deleteLike(like.id);
    return null;
  }

  return await likePost(user.id, post.id);
}

export async function createCommentService(
  username: string,
  postId: string,
  textContent: string,
  parentId?: string
) {
  const post = await getPostById(postId);

  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  await createComment(user.id, post.id, textContent, parentId);
}

export async function getPostCommentsService(postId: string) {
  const post = await getPostById(postId);

  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const comments = await getPostComments(post.id);

  const commentsMap: CommentsMap = new Map();

  comments.forEach((comment) => {
    (comment as MappedComment).children = [];
    commentsMap.set(comment.id, comment as MappedComment);
  });

  const commentsTree: MappedComment[] = [];

  for (const [_, comment] of commentsMap) {
    if (!comment.parentId) {
      commentsTree.push(comment);
      continue;
    }

    const parent = commentsMap.get(comment.parentId);

    if (!parent) {
      continue;
    }

    parent.children.push(comment);
  }

  return commentsTree;
}

export async function updateCommentService(
  username: string,
  commentId: string,
  textContent: string
) {
  const comment = await getComment(commentId);

  if (!comment) {
    throw new Error("COMMENT_NOT_FOUND");
  }

  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (comment.authorId !== user.id) {
    throw new Error("POST_NOT_OWNED_BY_USER");
  }

  await updateComment(commentId, textContent);
}

export async function deleteCommentService(
  username: string,
  commentId: string
) {
  const comment = await getComment(commentId);

  if (!comment) {
    throw new Error("COMMENT_NOT_FOUND");
  }

  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (comment.authorId !== user.id) {
    throw new Error("POST_NOT_OWNED_BY_USER");
  }

  await deleteComment(commentId);
}

import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyAccessToken";
import {
  createCommentController,
  createPostController,
  deleteCommentController,
  deletePostController,
  editPostController,
  getPostController,
  getPostsController,
  toggleLikeController,
  updateCommentController,
} from "../controllers/posts";
import { validateRequestData } from "../middleware/validateRequestData";
import {
  createCommentSchema,
  deleteCommentSchema,
  deletePostSchema,
  editPostSchema,
  getPostSchema,
  likePostSchema,
  updateCommentSchema,
} from "../validation/posts";

const router = Router();

router.get("/", getPostsController);
router.get("/:id", validateRequestData(getPostSchema), getPostController);
router.post("/create", verifyAccessToken, createPostController);
router.patch(
  "/edit/:id",
  verifyAccessToken,
  validateRequestData(editPostSchema),
  editPostController
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  validateRequestData(deletePostSchema),
  deletePostController
);
router.post(
  "/:id/toggleLike",
  verifyAccessToken,
  validateRequestData(likePostSchema),
  toggleLikeController
);
router.post(
  "/:id/comments",
  verifyAccessToken,
  validateRequestData(createCommentSchema),
  createCommentController
);
router.patch(
  "/:postId/comments/:commentId",
  verifyAccessToken,
  validateRequestData(updateCommentSchema),
  updateCommentController
);
router.delete(
  "/:postId/comments/:commentId",
  verifyAccessToken,
  validateRequestData(deleteCommentSchema),
  deleteCommentController
);

export default router;

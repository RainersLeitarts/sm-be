import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyAccessToken";
import {
  createPostController,
  deletePostController,
  editPostController,
  getPostController,
  getPostsController,
  toggleLikeController,
} from "../controllers/posts";
import { validateRequestData } from "../middleware/validateRequestData";
import {
  deletePostSchema,
  editPostSchema,
  getPostSchema,
  likePostSchema,
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
  "/delete/:id",
  verifyAccessToken,
  validateRequestData(deletePostSchema),
  deletePostController
);
router.post(
  "/toggleLike/:id",
  verifyAccessToken,
  validateRequestData(likePostSchema),
  toggleLikeController
);

export default router;

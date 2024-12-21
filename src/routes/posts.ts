import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyAccessToken";
import {
  createPostController,
  deletePostController,
  editPostController,
  getPostsController,
} from "../controllers/posts";
import { validateRequestData } from "../middleware/validateRequestData";
import { deletePostSchema, editPostSchema } from "../validation/posts";

const router = Router();

router.get("/", getPostsController);
router.post("/create", verifyAccessToken, createPostController);
router.patch(
  "/edit",
  verifyAccessToken,
  validateRequestData(editPostSchema),
  editPostController
);
router.delete(
  "/delete",
  verifyAccessToken,
  validateRequestData(deletePostSchema),
  deletePostController
);

export default router;

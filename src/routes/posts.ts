import { Request, Response, Router } from "express";
import { createPost } from "../models/posts";
import { verifyAccessToken } from "../middleware/verifyAccessToken";
import { createPostController, editPostController } from "../controllers/posts";

const router = Router();

router.post("/create", verifyAccessToken, createPostController);
router.patch("/edit", verifyAccessToken, editPostController);

export default router;

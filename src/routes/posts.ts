import { Request, Response, Router } from "express";
import { createPost } from "../models/posts";
import { verifyAccessToken } from "../middleware/verifyAccessToken";
import { createPostController } from "../controllers/posts";

const router = Router();

router.post("/create", verifyAccessToken, createPostController);

export default router;

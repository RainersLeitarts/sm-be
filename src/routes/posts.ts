import { Request, Response, Router } from "express";
import { createPost } from "../models/posts";
import { verifyAccessToken } from "../middleware/authenticateRoute";

const router = Router();

router.post("/create", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const { textContent } = req.body;
    
    await createPost({ textContent });
    res.status(201).json({ message: "Post created" });
  } catch (error) {
    console.log(error);
  }
});

export default router;

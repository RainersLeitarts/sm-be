import { Request, Response, Router } from "express";
import { createPost } from "../models/posts";

const router = Router()

router.post("/create", async (req: Request, res: Response) => {
    await createPost()
    res.status(201).json({message: "Post created"})
})


export default router
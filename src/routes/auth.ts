import { Request, Response, Router } from "express";

const router = Router()

router.post("/login", (req: Request, res: Response) => {
    res.status(200).json({message: "Hello there"})
})

export default router
import { Router } from "express";
import { throwErrorController } from "../controllers/tests";

const router = Router();

router.get("/throwError", throwErrorController);

export default router;

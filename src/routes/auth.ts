import { Router } from "express";
import {
  loginController,
  refreshTokenController,
  registerController,
} from "../controllers/auth";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/refresh", refreshTokenController);

export default router;

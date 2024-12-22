import { Router } from "express";
import {
  checkController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
} from "../controllers/auth";
import { validateRequestData } from "../middleware/validateRequestData";
import { loginSchema, registerSchema } from "../validation/auth";
import { verifyAccessToken } from "../middleware/verifyAccessToken";

const router = Router();

router.post(
  "/register",
  validateRequestData(registerSchema),
  registerController
);
router.post("/login", validateRequestData(loginSchema), loginController);
router.get("/refresh", refreshTokenController);
router.post("/logout", logoutController)
router.get("/check", verifyAccessToken, checkController)

export default router;

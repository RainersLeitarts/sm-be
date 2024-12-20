import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
} from "../controllers/auth";
import { validateRequestData } from "../middleware/validateRequestData";
import { loginSchema, registerSchema } from "../validation/auth";

const router = Router();

router.post(
  "/register",
  validateRequestData(registerSchema),
  registerController
);
router.post("/login", validateRequestData(loginSchema), loginController);
router.get("/refresh", refreshTokenController);
router.post("/logout", logoutController)

export default router;

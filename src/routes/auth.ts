import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { modifyRefreshToken, findUserByUsername } from "../models/users";
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

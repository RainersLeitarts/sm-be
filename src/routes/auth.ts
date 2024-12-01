import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  modifyRefreshToken,
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../models/users";

const router = Router();

const AUTH_TOKEN_EXPIRATION = "10m";

router.post("/register", async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(400).json({ message: "Invalid or missing credentials" });
    return;
  }

  const isEmailTaken = await findUserByEmail(email);

  if (isEmailTaken) {
    res.status(400).json({ message: "User with this username already exists" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  await createUser({ username, email, password: hashedPass });

  const jwtPayload = { email, username };
  const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
    expiresIn: AUTH_TOKEN_EXPIRATION,
  });
  const refreshToken = jwt.sign(jwtPayload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "168d",
  });

  await modifyRefreshToken(email, refreshToken);

  res
    .status(201)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: false })
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
    .json({ message: "User registered" });
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Invalid or missing credentials" });
    return;
  }

  const user = await findUserByUsername(username);

  if (!user) {
    res.status(400).json({ message: "User with such username not found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(403).json({ message: "Incorrect password" });
    return;
  }

  const jwtPayload = { email: user.email, username };

  const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
    expiresIn: AUTH_TOKEN_EXPIRATION,
  });
  const refreshToken = jwt.sign(jwtPayload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "168d",
  });

  await modifyRefreshToken(user.email, refreshToken);

  res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: false })
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
    .json({ message: "User authenticated" });
});

export default router;

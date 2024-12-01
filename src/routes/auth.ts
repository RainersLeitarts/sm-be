import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { modifyRefreshToken, createUser } from "../models/users";

const router = Router();

let userIds = 0;
const users: {
  id: string;
  email: string;
  username: string;
  password: string;
}[] = [];
const refreshTokens: { userId: string; refreshToken: string }[] = [];

const AUTH_TOKEN_EXPIRATION = "10m";

router.post("/register", async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(400).json({ message: "Invalid or missing credentials" });
    return;
  }

  const isEmailTaken = users.find((user) => {
    user.email === email;
  });

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

router.post("/login", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello there" });
});

export default router;

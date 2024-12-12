import { AUTH_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from "../config";
import { TokenPayload } from "../types/auth";
import jwt from "jsonwebtoken";

export function generateNewTokens(email: string, username: string) {
  const jwtPayload: TokenPayload = { email, username };

  const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
    expiresIn: AUTH_TOKEN_EXPIRATION,
  });
  const refreshToken = jwt.sign(jwtPayload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  return {
    accessToken,
    refreshToken,
  };
}
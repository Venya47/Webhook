import { Request, Response } from "express";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwt";

export const refresh = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded: any = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
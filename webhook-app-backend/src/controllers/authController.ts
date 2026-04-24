import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // check existing user
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "User registered",
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
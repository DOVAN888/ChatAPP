// @ts-nocheck
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message: "username、password、email、firstName、lastNameは必須です",
      });
    }

    const duplicate = await User.findOne({ username });

    if (duplicate) {
      return res.status(409).json({ message: "このユーザー名は既に使用されています" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${lastName} ${firstName}`,
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("signUp error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "ユーザー名またはパスワードが入力されていません" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "ユーザー名またはパスワードが正しくありません" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "ユーザー名またはパスワードが正しくありません" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      // @ts-ignore
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res
      .status(200)
      .json({ message: `${user.displayName}さん、ログインしました！`, accessToken });
  } catch (error) {
    console.error("signIn error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

export const signOut = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await Session.deleteOne({ refreshToken: token });
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("signOut error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "トークンが見つかりません" });
    }

    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res.status(403).json({ message: "トークンが無効または期限切れです" });
    }

    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "トークンの有効期限が切れました" });
    }

    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("refreshToken error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

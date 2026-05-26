import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Unauthorized - トークンが見つかりません"));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return next(new Error("Unauthorized - トークンが無効または期限切れです"));
    }

    const user = await User.findById(decoded.userId).select("-hashedPassword");

    if (!user) {
      return next(new Error("ユーザーが存在しません"));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error("socketAuthMiddleware error:", error);
    next(new Error("Unauthorized"));
  }
};

import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { displayName, bio, phone } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { displayName, bio, phone },
      { new: true, runValidators: true }
    ).select("-hashedPassword -avatarId");

    return res.status(200).json({ user: updated });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

export const authMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.error("authMe error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "クエリにusernameを指定してください" });
    }

    const user = await User.findOne({ username }).select(
      "_id displayName username avatarUrl"
    );

    return res.status(200).json({ user });
  } catch (error) {
    console.error("searchUserByUsername error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "ファイルがアップロードされていません" });
    }

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatarUrl: result.secure_url,
        avatarId: result.public_id,
      },
      { new: true }
    ).select("avatarUrl");

    if (!updatedUser.avatarUrl) {
      return res.status(400).json({ message: "アバターの取得に失敗しました" });
    }

    return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
  } catch (error) {
    console.error("uploadAvatar error:", error);
    return res.status(500).json({ message: "アップロードに失敗しました" });
  }
};

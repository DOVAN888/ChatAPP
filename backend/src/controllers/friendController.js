import Friend from "../models/Friend.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { io } from "../socket/index.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;
    const from = req.user._id;

    if (from === to) {
      return res
        .status(400)
        .json({ message: "自分自身にフレンドリクエストを送ることはできません" });
    }

    const userExists = await User.exists({ _id: to });

    if (!userExists) {
      return res.status(404).json({ message: "このユーザーは存在しません" });
    }

    let userA = from.toString();
    let userB = to.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriends) {
      return res.status(400).json({ message: "既にフレンドです" });
    }

    if (existingRequest) {
      return res.status(400).json({ message: "フレンドリクエストが既に送信済みです" });
    }

    const request = await FriendRequest.create({ from, to, message });

    const sender = await User.findById(from).select("_id displayName avatarUrl username").lean();
    io.to(to.toString()).emit("new-friend-request", {
      _id: request._id,
      from: sender,
      message: request.message,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    });

    return res
      .status(201)
      .json({ message: "フレンドリクエストを送信しました", request });
  } catch (error) {
    console.error("sendFriendRequest error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "フレンドリクエストが見つかりません" });
    }

    if (request.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "このリクエストを承認する権限がありません" });
    }

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    });

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(request.from)
      .select("_id displayName avatarUrl")
      .lean();

    return res.status(200).json({
      message: "フレンドリクエストを承認しました",
      newFriend: {
        _id: from?._id,
        displayName: from?.displayName,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.error("acceptFriendRequest error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "フレンドリクエストが見つかりません" });
    }

    if (request.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "このリクエストを拒否する権限がありません" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    return res.sendStatus(204);
  } catch (error) {
    console.error("declineFriendRequest error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friend.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .populate("userA", "_id displayName avatarUrl username")
      .populate("userB", "_id displayName avatarUrl username")
      .lean();

    if (!friendships.length) {
      return res.status(200).json({ friends: [] });
    }

    const friends = friendships.map((f) =>
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA
    );

    return res.status(200).json({ friends });
  } catch (error) {
    console.error("getAllFriends error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const populateFields = "_id username displayName avatarUrl";

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate("to", populateFields),
      FriendRequest.find({ to: userId }).populate("from", populateFields),
    ]);

    res.status(200).json({ sent, received });
  } catch (error) {
    console.error("getFriendRequests error:", error);
    return res.status(500).json({ message: "システムエラーが発生しました" });
  }
};

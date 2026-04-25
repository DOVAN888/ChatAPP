import express from "express";

import {
  acceptFriendRequest,
  sendFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests,
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/requests", sendFriendRequest);  // gửi lời mời kết bạn

router.post("/requests/:requestId/accept", acceptFriendRequest);//chap nhan  loi moi ket ban
router.post("/requests/:requestId/decline", declineFriendRequest);// tu choi loi moi ket ban 

router.get("/", getAllFriends);// lay danh sach ban be
router.get("/requests", getFriendRequests);// lay danh sach loi moi ket ban

export default router;

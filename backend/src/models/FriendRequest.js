import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    from: {  // la id nguoi gui loi moi ket ban
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {  // la id nguoi nhan loi moi ket ban 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { // tin nhan kem theo loi moi ket ban
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });// dam bao mot ngoi chi gui duoc mot loi moi ket ban de mot nguoi khong bi 

friendRequestSchema.index({ from: 1 }); // de tim kiem nnhanh loi moi ket ban theo nguoi gui 

friendRequestSchema.index({ to: 1 });// de tim kiem nhanh loi moi ket ban theo nguoi nhan

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;

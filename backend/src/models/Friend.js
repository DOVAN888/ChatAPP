import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

friendSchema.pre("save", function (next) { //doan nay dam bao userA luon co gia tri nho hon userB de tranh trung lap ban ghi 
  const a = this.userA.toString();
  const b = this.userB.toString();

  if (a > b) {
    this.userA = new mongoose.Types.ObjectId(b);
    this.userB = new mongoose.Types.ObjectId(a);
  }

  next();
});

// pre la de thuc hien mot ham truoc khi hanh dong nao do xay ra
// index de tao chi muc tren cap truogg userA va userB de dam bao tinh duy nhat

friendSchema.index({ userA: 1, userB: 1 }, { unique: true });

const Friend = mongoose.model("Friend", friendSchema);

export default Friend;

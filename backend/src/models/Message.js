import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId, //nghia la id cua conversation
      ref: "Conversation",  // tro den model conversation
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // tro den model user
      required: true,
    },
    content: {
      type: String, // noi dug tin nhan dang chu 
      trim: true, // tu dong cat bo khoang trang thua o dau va cuoi
    },
    imgUrl: {
      type: String,
    },
  },
  {
    timestamps: true,// tu dong tao truong createdAt va updatedAt
  }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });//de tim kiem nhanh hon theo conversion va  thoi gian tao 

const Message = mongoose.model("Message", messageSchema);

export default Message;

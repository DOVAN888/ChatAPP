import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // @ts-ignore
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("データベース接続に成功しました");
  } catch (error) {
    console.log("データベース接続エラー:", error);
    process.exit(1);
  }
};

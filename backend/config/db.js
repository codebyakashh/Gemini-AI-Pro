import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // यहाँ MONGO_URI (capital I) का इस्तेमाल किया गया है
    const dbURL =
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/ai-assistant";

    const conn = await mongoose.connect(dbURL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
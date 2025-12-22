import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://jyoti:Ankita123@jyoti.fajlx1r.mongodb.net/?retryWrites=true&w=majority&appName=Jyoti');
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); 
  }
};

export default connectDB;

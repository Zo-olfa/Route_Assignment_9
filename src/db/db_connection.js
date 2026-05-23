import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // return error after 5 seconds
    });
    console.log(`Connected to MongoDB Successfully on ${process.env.MONGODB_URI}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

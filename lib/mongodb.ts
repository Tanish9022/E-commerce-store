import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "CRITICAL: MONGODB_URI is not defined. Please check your .env.local file (local) or Vercel Environment Variables (production)."
  );
}

if (!MONGODB_URI.startsWith("mongodb://") && !MONGODB_URI.startsWith("mongodb+srv://")) {
  throw new Error(
    "CRITICAL: MONGODB_URI has an invalid scheme. It must start with 'mongodb://' or 'mongodb+srv://'. Current value starts with: " + MONGODB_URI.substring(0, 10)
  );
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Connecting to MongoDB Atlas...");
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB Connection Established");
      return mongoose;
    }).catch(err => {
      console.error("MongoDB Connection Error:", err);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;

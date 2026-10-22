import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri === 'your_mongodb_atlas_connection_string') {
    console.warn('\n⚠️  WARNING: MONGODB_URI is not configured in backend/.env!');
    console.warn('⚠️  Please add your MongoDB Atlas connection string to backend/.env to persist data.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    // Log safe error without printing raw connection string (which might contain passwords)
    console.error(`❌ MongoDB connection error: ${error.message}`);
    return false;
  }
};

export const checkDatabaseStatus = () => {
  // 1 = connected, 2 = connecting, 0 = disconnected, 3 = disconnecting
  return mongoose.connection.readyState === 1;
};

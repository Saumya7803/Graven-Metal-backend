import mongoose from 'mongoose';

let inMemoryServer = null;

export const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri && process.env.NODE_ENV !== 'production') {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    inMemoryServer = await MongoMemoryServer.create();
    uri = inMemoryServer.getUri();
    process.env.MONGODB_URI = uri;
    console.warn('MONGODB_URI not set. Started local in-memory MongoDB for development.');
  }

  if (!uri) {
    throw new Error('Missing required environment variable: MONGODB_URI');
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(uri, {
      autoIndex: process.env.NODE_ENV !== 'production',
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 10),
      minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE || 1),
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000),
      socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 45000),
    });

    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close(false);
  }

  if (inMemoryServer) {
    await inMemoryServer.stop();
    inMemoryServer = null;
  }
};

import mongoose from 'mongoose';
import chalk from 'chalk';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      ssl: true,
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log(`${chalk.green(' [✔] ')}${chalk.white('DATABASE ')}: ${chalk.green.bold('READY')}`);
    return cached.conn;
  } catch (error) {
    console.error(`${chalk.red(' [✘] ')}${chalk.white('DATABASE ')}: ${chalk.red.bold('OFFLINE')}`);
    cached.promise = null;
    throw error;
  }
};

export default connectDB;

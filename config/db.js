import mongoose from 'mongoose';
import chalk from 'chalk';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      ssl: true,
    });
    console.log(`${chalk.green(' [✔] ')}${chalk.white('DATABASE ')}: ${chalk.green.bold('READY')}`);
  } catch (error) {
    console.error(`${chalk.red(' [✘] ')}${chalk.white('DATABASE ')}: ${chalk.red.bold('OFFLINE')}`);
    process.exit(1);
  }
};

export default connectDB;

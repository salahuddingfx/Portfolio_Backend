const mongoose = require('mongoose');
const chalk = require('chalk');

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

module.exports = connectDB;

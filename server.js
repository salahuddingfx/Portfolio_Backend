require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin.routes');

const chalk = require('chalk');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const startupSequence = async () => {
  const ascii = `
   ██████╗  █████╗ ██╗      █████╗ ██╗  ██╗    ██╗   ██╗██████╗ ██████╗ ██╗███╗   ██╗
  ██╔════╝ ██╔══██╗██║     ██╔══██╗██║  ██║    ██║   ██║██╔══██╗██╔══██╗██║████╗  ██║
  ╚█████╗  ███████║██║     ███████║███████║    ██║   ██║██║  ██║██║  ██║██║██╔██╗ ██║
   ╚═══██╗ ██╔══██║██║     ██╔══██║██╔══██║    ██║   ██║██║  ██║██║  ██║██║██║╚██╗██║
  ██████╔╝ ██║  ██║███████╗██║  ██║██║  ██║    ╚██████╔╝██████╔╝██████╔╝██║██║ ╚████║
  ╚═════╝  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝
  `;

  console.clear();
  console.log(chalk.cyan.bold(ascii));
  await sleep(500);

  const logs = [
    { label: 'STATUS', value: 'LIVE', color: chalk.green.bold },
    { label: 'PORT', value: PORT, color: chalk.white },
    { label: 'ENVIRONMENT', value: process.env.NODE_ENV || 'production', color: chalk.magenta },
    { label: 'MAIL SERVICE', value: 'READY', color: chalk.blue },
  ];

  console.log(chalk.cyan('─'.repeat(80)));
  for (const log of logs) {
    process.stdout.write(chalk.white(` [»] ${log.label.padEnd(12)} : `));
    await sleep(100);
    console.log(log.color(log.value));
    await sleep(150);
  }
  console.log(chalk.cyan('─'.repeat(80)) + '\n');
};

app.listen(PORT, async () => {
  await startupSequence();
  connectDB();
});

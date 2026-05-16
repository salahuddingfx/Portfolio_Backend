import chalk from 'chalk';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const startupSequence = async (PORT) => {
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

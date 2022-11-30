const chalk = require("chalk");

const error = (message) => {
  console.log(chalk.red(`[ERROR] ${message} `));
};

const info = (message) => {
  console.log(`${chalk.green("[INFO] ")} ${message}`);
};

const report = (message) => {
  console.log(chalk.yellow(`[REPORT] ${message}`));
};

const highlight = (message) => {
  console.log(chalk.yellow(message));
};

module.exports = {
  error,
  info,
  report,
  highlight,
};

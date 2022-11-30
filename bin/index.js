#!/usr/bin/env node

const { crawl } = require("./src/crawl");
const { printReport } = require("./src/report");
const logger = require("./src/log");
const yargs = require("yargs");

const run = async () => {
  const options = yargs.usage("Usage: -w <website url>").option("w", {
    alias: "website",
    describe: "Website to crawl",
    type: "string",
    demandOption: true,
  }).argv;

  // console.log(options);
  if (!options.website) {
    return;
  }
  const baseURL = options.website;
  logger.info(`Started crawling the website ${baseURL}`);

  const pages = await crawl(baseURL, baseURL, {});

  logger.info(`Finished crawling the website ${baseURL}`);
  logger.highlight(
    "-----------------------------------------------------------------------------------------------"
  );
  logger.report("Crawler Report: ");
  printReport(pages);
  return;
};

run();

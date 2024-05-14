#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const startServer = require("../server");
const { AllCommands } = require("./displayAllCommands");
const createModules = require("./createModule");
const createApi = require("./createApi");
const createCrons = require("./createCrons");

const argv = yargs(hideBin(process.argv)).argv;
console.log(argv._);
if (argv._.length === 0) {
  AllCommands();
} else {
  yargs
    .command("start", "Start the framework server", startServer)
    .command(
      "create-module [modulename]",
      "Create a new module in the API folder",
      (yargs) => {
        yargs.option("module", {
          alias: "m",
          describe: "Name of the module",
          type: "string",
        });
      },
      (argv) => {
        createModules(argv);
      }
    )
    .command(
      "create-api",
      "Create API with specified parameters",
      (yargs) => {
        yargs
          .option("module", {
            alias: "m",
            describe: "Name of the module",
            type: "string",
          })
          .option("method", {
            alias: "meth",
            describe: "HTTP method for the API",
            type: "string",
          })
          .option("action", {
            alias: "act",
            describe: "Action to be performed by the API",
            type: "string",
          })
          .option("middlewares", {
            alias: "mid",
            describe: "Module middlewares (comma-separated)",
            type: "string",
          })
          .option("path", {
            alias: "p",
            describe: "Endpoint path",
            type: "string",
          });
      },
      (argv) => {
        createApi(argv);
      }
    )
    .command(
      "create-crons [expression]",
      "Create a new file in the crons folder with expression",
      (yargs) => {
        yargs.option("expression", {
          alias: "expr",
          describe: "Expression for the Running Function",
          type: "string",
        });
      },
      (argv) => {
        createCrons(argv);
      }
    )
    .help().argv;
}

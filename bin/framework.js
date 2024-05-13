#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const startServer = require("../server");


const argv = yargs(hideBin(process.argv))
  .command("start", "Start the framework server", startServer)
  .command(
    "create-module [modulename]",
    "Create a new module in the API folder",
    (yargs) => {
      yargs
      .option("module", {
        alias: "m",
        describe: "Name of the module",
        type: "string",
      })
    },
    async (argv) => {
      const createModules = await require('./createModule');
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
        })
        .option("globalmiddlewares", {
          alias: "gmid",
          describe: "Global middlewares (comma-separated)",
          type: "string",
        })
        .option("public", {
          alias: "pub",
          describe: "Whether the API is public (true/false)",
          type: "boolean",
        })
        .option("pathfromroot", {
          alias: "pfr",
          describe: "Whether the path is from root (true/false)",
          type: "boolean",
        });
    },
    async (argv) => {
      const createApi = await require('./createApi');
      createApi(argv)
      
    }
  )
  
  .help()
  .argv;


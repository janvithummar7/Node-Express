#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const startServer = require("../server");

const promptModuleName = async () => {
  const { default: inquirer } = await import('inquirer');
  const answer = await inquirer.prompt({
    type: "input",
    name: "moduleName",
    message: "Enter the name of the module to create:",
    validate: (input) => {
      return input.trim() !== ""; 
    },
  });
  return answer.moduleName;
};

const argv = yargs(hideBin(process.argv))
  .command("start", "Start the framework server", startServer)
  .command(
    "create module [modulename]",
    "Create a new module in the API folder",
    (yargs) => {
      yargs.positional("modulename", {
        type: "string",
        description: "Name of the module to create",
      });
    },
    async (argv) => {
      if (argv.modulename) {
        const createModules = await require('./createModule');
        createModules(argv.modulename); 
      } else {
        const moduleName = await promptModuleName();
        const createModules = await require('./createModule');
        createModules(moduleName); 
      }
    }
  )
  
  .help()
  .argv;


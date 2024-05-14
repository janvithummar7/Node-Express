const showAllCommands = async () => {
  const { default: inquirer } = await import("inquirer");
  const commands = [
    "framework start",
    "framework create-module",
    "framework create-api",
    "framework create-crons",
  ];

  const { selectedCommand } = await inquirer.prompt({
    type: "list",
    name: "selectedCommand",
    message: "Select a command:",
    choices: commands,
  });
  return selectedCommand;
};

const executeCommand = async (command) => {
  switch (command) {
    case "framework start":
      const startServer = require("../server");
      startServer();
      break;
    case "framework create-module":
      const createModules = await require("./createModule");
      createModules();
      break;
    case "framework create-api":
      const createApi = await require("./createApi");
      createApi();
      break;
    case "framework create-crons":
        const createCrons = await require("./createCrons");
        createCrons();
      break;
    default:
      console.log(`Command "${command}" not recognized.`);
  }
};

const AllCommands = async () => {
  const selectedCommand = await showAllCommands();
  await executeCommand(selectedCommand);
};

module.exports = { AllCommands };

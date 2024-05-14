const fs = require("fs");
const path = require("path");

const createCrons = async (argv) => {
  let expression;

  if (!argv || !argv.expression) {
    expression = await promptExpression();
  } else {
    expression = argv.expression;
  }

  console.log("Creating file with Expression: ", expression);
  const cronsDir = path.join(__dirname, "../crons");

  try {
    fs.readdir(cronsDir, (err, files) => {
      const fileLength = files.length;
      const routeFilePath = path.join(cronsDir, `crons${fileLength + 1}.js`);

      fs.writeFileSync(routeFilePath, getCronsFunctionContent(expression));
      console.log(`Created File 'crons${fileLength + 1}.js' in Crons folder.`);
    });
  } catch (err) {
    console.error(`Error creating ''crons${fileLength + 1}.js' File :`, err);
  }
};

const promptExpression = async () => {
  const { default: inquirer } = await import("inquirer");
  const answer = await inquirer.prompt({
    type: "input",
    name: "expression",
    message: "Enter expression fro your cron operation:",
    validate: (input) => {
      return input.trim() !== "";
    },
  });
  return answer.expression;
};

const getCronsFunctionContent = (expression) => {
  return ` 
    function functionName() {
      cron.schedule('${expression}', () => {
        console.log('Crons is running');
      });
    }

    module.exports = {functionName}
  `;
};

module.exports = createCrons;

const fs = require("fs");
const path = require("path");

const createModules = async (argv) => {
  // console.log(argv);
  let modulename;
  
  if (!argv || !argv.modulename) {
    modulename = await promptModuleName();
    console.log(modulename);
  }
  else{
    modulename = argv.modulename
  }
  
    if (!isValidModuleName(modulename)) {
        console.error(`Error: '${modulename}' is not a valid module name.`);
        return;
    }

    console.log("Creating module:", modulename);
    const apiDir = path.join(__dirname, "../api");
    const moduleDir = path.join(apiDir, modulename);
  
    if (fs.existsSync(moduleDir)) {
      console.error(`Error: Directory '${modulename}' already exists in API folder.`);
      return;
    }
  
    try {
      fs.mkdirSync(moduleDir);
  
      ["controllers", "services", "functions", "middleware"].forEach((subdir) => {
        const subDirPath = path.join(moduleDir, subdir);
        fs.mkdirSync(subDirPath);
  
        const sampleFilePath = path.join(subDirPath, `sample_${subdir}.js`);
        fs.writeFileSync(sampleFilePath, getSampleFunctionContent(subdir, modulename));
      });
  
      const routeFilePath = path.join(moduleDir, "routes.json");
      fs.writeFileSync(routeFilePath, JSON.stringify([], null, 2));
  
      console.log(`Created directory '${modulename}' in API folder.`);
    } catch (err) {
      console.error(`Error creating module '${modulename}':`, err);
    }
  };



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
  

  const isValidModuleName = async (modulename) => {
    const validModuleNameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]+$/; 
    return await typeof modulename === "string" && validModuleNameRegex.test(modulename);
  };
  
  const getSampleFunctionContent = (subdir, modulename) => {
    return ` // Sample ${subdir} function for ${modulename}
    function functionName(req, res) {
        console.log("Function Running");
        res.send("Function Running");
    }

    module.exports = {functionName}
  `;
  };

 
  

  module.exports = createModules
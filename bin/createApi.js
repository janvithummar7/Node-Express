const fs = require("fs");
const path = require("path");

const createApi = async (argv) => {


    if (!argv || !argv.module) {
      var modules = await promptModulesSelection();
    }
    if (!argv || !argv.method) {
      var method = await promptInput("Enter method:");
    } 
    if (!argv || !argv.endpointPath) {
      var endpointPath = await promptInput("Enter endpoint path (/):");
    } 
    if (!argv || !argv.action) {
      var action = await promptInput("Enter action:");
    } 
    if (!argv || !argv.isPublic) {
      var isPublic = await promptConfirm("Is public (y/N):");
    } 
    if (!argv || !argv.moduleMiddlewares) {
      var moduleMiddlewares = await promptInput("Enter module middlewares (comma-separated):");
    } 
    if (!argv || !argv.globalMiddlewares) {
      var globalMiddlewares = await promptInput("Enter global middlewares (comma-separated):");
    } 
    if (!argv || !argv.pathFromRoot) {
      var pathFromRoot = await promptConfirm("Is path from root (y/N):");
    }
    else {
      var { modules : module, method, action, moduleMiddlewares : middlewares, endpointPath : path, globalMiddlewares : globalmiddlewares, isPublic, pathFromRoot : pathfromroot } = argv;
    }


      const routeData = {
        method,
        path: endpointPath,
        action,
        public: isPublic ,
        globalMiddlewares: globalMiddlewares.split(','),
        moduleMiddlewares: moduleMiddlewares.split(','),
        pathFromRoot: pathFromRoot ,
      };

      
      storeRouteData(modules, routeData);

      console.log("API created successfully.");
}


const promptModulesSelection = async () => {
    const { default: inquirer } = await import('inquirer');

    const moduleChoices = fs.readdirSync(path.join(__dirname, "../api"))
   
    const { module } = await inquirer.prompt({
      type: "list",
      name: "module",
      message: "Select a module:",
      choices: moduleChoices,
    });
  
    return module;
  };
  
  const promptInput = async (message) => {
    const { default: inquirer } = await import('inquirer');
  
    const { value } = await inquirer.prompt({
      type: "input",
      name: "value",
      message,
    });
  
    return value.trim();
  };
  
  const promptConfirm = async (message) => {
    const { default: inquirer } = await import('inquirer');
  
    const { confirm } = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message,
      default: false,
    });
  
    return confirm;
  };
  
  const storeRouteData = (moduleName, routeData) => {
    const apiDir = path.join(__dirname, "../api");
    const moduleDir = path.join(apiDir, moduleName);
    const routesFilePath = path.join(moduleDir, "routes.json");
  
    const existingRoutes = fs.existsSync(routesFilePath) ? JSON.parse(fs.readFileSync(routesFilePath)) : [];
    existingRoutes.push(routeData);
  
    fs.writeFileSync(routesFilePath, JSON.stringify(existingRoutes, null, 2));
  };

module.exports = createApi;
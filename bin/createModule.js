const fs = require("fs");
const path = require("path");

const createModules = async (modulename) => {

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
      const routeContent = getDefaultRouteConfiguration() 
      fs.writeFileSync(routeFilePath, JSON.stringify(routeContent, null, 2));
  
      console.log(`Created directory '${modulename}' in API folder.`);
    } catch (err) {
      console.error(`Error creating module '${modulename}':`, err);
    }
  };



  const isValidModuleName = (modulename) => {
    const validModuleNameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]+$/; 
    return typeof modulename === "string" && validModuleNameRegex.test(modulename);
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

  const getDefaultRouteConfiguration = () => {
    return [
        {
          "path": "/signup",
          "method": "get",
          "action": "auth.signup",
          "public": true,
          "globalMiddlewares": [],
          "middlewares": [],
          "pathFromRoot": false,
          "enabled": true
        },
        {
          "path": "/login",
          "method": "post",
          "action": "auth.login",
          "public": false,
          "globalMiddlewares": [],
          "middlewares": [],
          "pathFromRoot": false,
          "enabled": true
        },
        {
          "path": "/view",
          "method": "post",
          "action": "auth.view",
          "public": true,
          "globalMiddlewares": [],
          "middlewares": [],
          "pathFromRoot": false,
          "enabled": true
        },
        {
          "path": "/edit",
          "method": "post",
          "action": "auth.edit",
          "public": false,
          "globalMiddlewares": [],
          "middlewares": [],
          "pathFromRoot": false,
          "enabled": false
        },
        {
          "path": "/remove",
          "method": "delete",
          "action": "auth.remove",
          "public": true,
          "globalMiddlewares": [],
          "middlewares": [],
          "pathFromRoot": false,
          "enabled": true
        },
        {
          "path": "/create",
          "method": "get",
          "action": "auth.create",
          "public": true,
          "globalMiddlewares": [],
          "middlewares": [],
          "pathFromRoot": false,
          "enabled": true
        }
      ]
  }
  

  module.exports = createModules
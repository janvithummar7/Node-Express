const path = require("path");
const fs = require("fs").promises;

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m'
};
const methodNames = ['get', 'post', 'put', 'delete'];


const Routes = async (app) => {
    const files = await fs.readdir("api");
    if(files.length === 0) return console.warn(`${colors.yellow}No Module found in "api" directory${colors.reset}`);
    for (let i = 0; i < files.length; i++) {
        const filePath = `./api/${files[i]}/routes.json`;
        
        try {
            const data = await fs.readFile(filePath, 'utf8');
            const folderName = path.basename(path.dirname(filePath));
            const jsonData = JSON.parse(data);
            const warnings = [];
            const err_msg = [];
            const notValidRoutes = [];

            jsonData.forEach((route, index) => {
                
                if (!route || typeof route !== 'object') {
                    err_msg.push(`Invalid route object at index ${index}`);
                    notValidRoutes.push(route);
                }

                if (typeof route.path !== 'string' || !route.path.startsWith('/') || route.path.trim() === '') {
                    err_msg.push(`Invalid path in route at index ${index}: ${route.path}`);
                    notValidRoutes.push(route);
                }

                if (typeof route.method !== 'string' || !methodNames.includes(route.method.toLowerCase()) || route.method.trim() === '') {
                    err_msg.push(`Invalid or missing method in route at index ${index}: ${route.method}`);
                    notValidRoutes.push(route);
                }

                if (typeof route.action !== 'string' || route.action.trim() === '') {
                    err_msg.push(`Invalid or missing action in route at index ${index}: ${route.action}`);
                    notValidRoutes.push(route);

                }

                if (typeof route.public !== 'boolean') {
                    warnings.push(`Invalid 'public' value in route at index ${index}: ${route.public}`);
                }

                if (typeof route.pathFromRoot !== 'boolean') {
                    warnings.push(`Invalid 'pathFromRoot' value in route at index ${index}: ${route.pathFromRoot}`);
                }

                if (!Array.isArray(route.globalMiddlewares)) {
                    warnings.push(`Invalid 'globalMiddlewares' value in route at index ${index}: ${route.globalMiddlewares}`);
                }

                if (!Array.isArray(route.middlewares)) {
                    warnings.push(`Invalid 'middlewares' value in route at index ${index}: ${route.middlewares}`);
                }

                if (typeof route.enabled !== 'boolean') {
                    warnings.push(`Invalid 'enabled' value in route at index ${index}: ${route.enabled}`);
                }
                
                if (!notValidRoutes.includes(route)) { 
                    const routePath = route.path;
                    const routeMethod = route.method.toLowerCase();
                    const action = route.action;
                    const middlewaresAction = route.middlewares || [];
                    const globalMiddlewaresAction = route.globalMiddlewares || [];
                    const isPublic = route.public;


                    const [fileName, functionName] = action.split('.');
                    const controllerPath = `../api/${files[i]}/controllers/${fileName}`;
                    const controllers = require(controllerPath);
                    const handler = controllers[functionName];

                    const MiddlewareHandler = [];

                    middlewaresAction.forEach((middlewareAction) => {
                        const [MiddlewareFileName, MiddlewareFunctionName] = middlewareAction.split('.');
                        const middlewarePath = `../api/${files[i]}/middleware/${MiddlewareFileName}`;
                        const middlewares = require(middlewarePath);
                        MiddlewareHandler.push(middlewares[MiddlewareFunctionName]);
                    });

                    globalMiddlewaresAction.forEach((globalMiddlewareAction) => {
                        const [GlobalMiddlewareFileName, GlobalMiddlewareFunctionName] = globalMiddlewareAction.split('.');
                        const globalMiddlewarePath = `../middlewares/${GlobalMiddlewareFileName}`;
                        const globalMiddlewares = require(globalMiddlewarePath);
                        MiddlewareHandler.push(globalMiddlewares[GlobalMiddlewareFunctionName]);
                    });

                    const verifyTokenPath = require('../middlewares/globalMiddlewares')
                    const verifyToken = verifyTokenPath.verifyToken

                    if (isPublic) {
                        app[routeMethod](routePath, MiddlewareHandler, handler);
                        console.log(`Route set up from ${folderName}: ${routeMethod.toUpperCase()} ${fileName}${routePath}`);
                    } else {
                        app[routeMethod](routePath, verifyToken, MiddlewareHandler, handler);
                        console.log(`Route set up from ${folderName}: ${routeMethod.toUpperCase()} ${fileName}${routePath} (Protected)`);
                    }
                }

            });


            if (err_msg.length > 0) {
                console.warn('\n');
                err_msg.forEach((errMsg) => {
                    console.warn(`${colors.red}[Error]: ${errMsg} [Module]: ${folderName}${colors.reset}\n`);
                });
            }
            if (warnings.length > 0) {
                console.warn('\n');
                warnings.forEach((warning) => {
                    console.warn(`${colors.yellow}[Warning]: ${warning} [Module]: ${folderName}${colors.reset}\n`);
                });
            }

        }catch (error) {
            console.error(`${colors.red}Error reading or parsing JSON file:${colors.reset}`, error);
        }
    }
}


module.exports = {Routes};

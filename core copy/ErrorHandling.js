const fs = require('fs');
const path = require('path');


const ErrorHandling = (callback) => {
    
const files = fs.readdirSync("api");

files.forEach(file => {

    

const filePath = `./api/${file}/routes.json`;
const methodNames = ['get', 'post', 'put', 'delete'];

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m'
};
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`${colors.red}Error reading file:${colors.reset}`, err);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            const folderName = path.basename(path.dirname(filePath));
            const warnings = [];
            const err_msg = [];

            jsonData.forEach((route, index) => {
                console.log(`\n ${JSON.stringify(route)}`);

                if (!route || typeof route !== 'object') {
                    err_msg.push(`Invalid route object at index ${index}`);
                }

                if (typeof route.path !== 'string' || !route.path.startsWith('/') || route.path.trim() === '') {
                    err_msg.push(`Invalid path in route at index ${index}: ${route.path}`);
                }

                if (typeof route.method !== 'string' || !methodNames.includes(route.method.toLowerCase()) || route.method.trim() === '') {
                    err_msg.push(`Invalid or missing method in route at index ${index}: ${route.method}`);
                }

                if (typeof route.action !== 'string' || route.action.trim() === '') {
                    err_msg.push(`Invalid or missing action in route at index ${index}: ${route.action}`);
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
            });

            callback(null, warnings, err_msg, folderName, jsonData);
        } catch (error) {
            console.error(`${colors.red}Error parsing JSON:${colors.reset}`, error);
            callback(error);
        }

    });
})

};


// const Routes = (app, jsonData) => {

//     jsonData.forEach(route => {
//         const routePath = route.path;
//         const routeMethod = route.method.toLowerCase();
//         const action = route.action;
//         const middlewaresAction = route.middlewares;
//         const globalMiddlewaresAction = route.globalMiddlewares;

//         // console.log(middlewaresAction,"middleware-----")
//         // console.log(globalMiddlewaresAction,"globalmiddleware-----")

//         const [fileName, functionName] = action.split('.');
//         const controllerPath = `../api/${files[0]}/controllers/${fileName}`;
//         const controllers = require(controllerPath);
//         const handler = controllers[functionName];


//         const MiddlewareHandler = []
//         if(middlewaresAction.length > 0){
//             middlewaresAction.forEach((middlewareAction) => {            
//                 const [MiddlewareFileName,MiddlewareFunctionName] = middlewareAction.split('.');
//                 const middlewarePath = `../api/${files[0]}/middleware/${MiddlewareFileName}`;
//                 const middlewares = require(middlewarePath);
//                 MiddlewareHandler.push(middlewares[MiddlewareFunctionName]);
//             })
//         }
//         if(globalMiddlewaresAction.length > 0){
//             globalMiddlewaresAction.forEach((globalMiddlewareAction) => {            
//                 const [GlobalMiddlewareFileName,GlobalMiddlewareFunctionName] = globalMiddlewareAction.split('.');
//                 const globalMiddlewarePath = `../middlewares/${GlobalMiddlewareFileName}`;
//                 const globalMiddlewares = require(globalMiddlewarePath);
//                 MiddlewareHandler.push(globalMiddlewares[GlobalMiddlewareFunctionName]);
//             })
//         }

//             app[routeMethod](routePath, MiddlewareHandler, handler);
//             console.log(`Route set up: ${routeMethod.toUpperCase()} ${fileName}${routePath}`);
       
//     });
// };

module.exports = { ErrorHandling };

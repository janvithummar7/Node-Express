const fs = require('fs');

const files = fs.readdirSync("api");

const Routes = (app, jsonData) => {

    jsonData.forEach(route => {
        const routePath = route.path;
        const routeMethod = route.method.toLowerCase();
        const action = route.action;
        const middlewaresAction = route.middlewares;
        const globalMiddlewaresAction = route.globalMiddlewares;

        // console.log(middlewaresAction,"middleware-----")
        // console.log(globalMiddlewaresAction,"globalmiddleware-----")

        const [fileName, functionName] = action.split('.');
        const controllerPath = `../api/${files[0]}/controllers/${fileName}`;
        const controllers = require(controllerPath);
        const handler = controllers[functionName];


        const MiddlewareHandler = []
        if(middlewaresAction.length > 0){
            middlewaresAction.forEach((middlewareAction) => {            
                const [MiddlewareFileName,MiddlewareFunctionName] = middlewareAction.split('.');
                const middlewarePath = `../api/${files[0]}/middleware/${MiddlewareFileName}`;
                const middlewares = require(middlewarePath);
                MiddlewareHandler.push(middlewares[MiddlewareFunctionName]);
            })
        }
        if(globalMiddlewaresAction.length > 0){
            globalMiddlewaresAction.forEach((globalMiddlewareAction) => {            
                const [GlobalMiddlewareFileName,GlobalMiddlewareFunctionName] = globalMiddlewareAction.split('.');
                const globalMiddlewarePath = `../middlewares/${GlobalMiddlewareFileName}`;
                const globalMiddlewares = require(globalMiddlewarePath);
                MiddlewareHandler.push(globalMiddlewares[GlobalMiddlewareFunctionName]);
            })
        }

            app[routeMethod](routePath, MiddlewareHandler, handler);
            console.log(`Route set up: ${routeMethod.toUpperCase()} ${fileName}${routePath}`);
       
    });
};

module.exports = { Routes };

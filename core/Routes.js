const { log } = require('console');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const files = fs.readdirSync("api");

const Routes = (app, jsonData) => {
    jsonData.forEach(route => {
        const routePath = route.path;
        const routeMethod = route.method.toLowerCase();
        const action = route.action;
        const middlewaresAction = route.middlewares;
        const globalMiddlewaresAction = route.globalMiddlewares;
        const isPublic = route.public;

        const [fileName, functionName] = action.split('.');
        const controllerPath = `../api/${files[0]}/controllers/${fileName}`;
        const controllers = require(controllerPath);
        const handler = controllers[functionName];

        const middlewareHandlers = [];

        if (middlewaresAction.length > 0) {
            middlewaresAction.forEach(middlewareAction => {
                const [MiddlewareFileName, MiddlewareFunctionName] = middlewareAction.split('.');
                const middlewarePath = `../api/${files[0]}/middleware/${MiddlewareFileName}`;
                const middlewares = require(middlewarePath);
                middlewareHandlers.push(middlewares[MiddlewareFunctionName]);
            });
        }

        if (globalMiddlewaresAction.length > 0) {
            globalMiddlewaresAction.forEach(globalMiddlewareAction => {
                const [GlobalMiddlewareFileName, GlobalMiddlewareFunctionName] = globalMiddlewareAction.split('.');
                const globalMiddlewarePath = `../middlewares/${GlobalMiddlewareFileName}`;
                const globalMiddlewares = require(globalMiddlewarePath);
                middlewareHandlers.push(globalMiddlewares[GlobalMiddlewareFunctionName]);
            });
        }

        const verifyToken = (req, res, next) => {
            var token = jwt.sign({ jsonData }, process.env.SECRET_KEY, { expiresIn: '1d' });
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
                }
                req.decoded = decoded;
                console.log("Token Verify");
                next();
            });
        };

        if (isPublic) {
            app[routeMethod](routePath, middlewareHandlers, handler);
            console.log(`Route set up: ${routeMethod.toUpperCase()} ${fileName}${routePath}`);
        } else {
            app[routeMethod](routePath, verifyToken, middlewareHandlers, handler);
            console.log(`Route set up: ${routeMethod.toUpperCase()} ${fileName}${routePath} (Protected)`);
        }
    });
};

module.exports = { Routes };

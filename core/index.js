const fs = require('fs');
const express = require('express');
const path = require('path');
const {home, signup, login} = require('../api/auth/controllers/pageControllers');
const middlewares =  require('../api/auth/middleware/authMiddleware')

const filePath = '../api/auth/routes.json';
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
        const app = express();
        const folderName = path.basename(path.dirname(filePath));

        const warnings = jsonData.reduce((acc, route, index) => {
            console.log(`\n ${JSON.stringify(route)}`);

            if (!route || typeof route !== 'object') {
                acc.push(`Invalid route object at index ${index}`);
                return acc; 
            }

            if (typeof route.path !== 'string' || !route.path.startsWith('/') || route.path.trim() === '') {
                acc.push(`Invalid path in route at index ${index}: ${route.path}`);
            }

            if (typeof route.method !== 'string' || !methodNames.includes(route.method.toLowerCase()) || route.method.trim() === '') {
                acc.push(`Invalid or missing method in route at index ${index}: ${route.method}`);
            }

            if (typeof route.action !== 'string' || route.action.trim() === '') {
                acc.push(`Invalid or missing action in route at index ${index}: ${route.action}`);
            }

            if (typeof route.public !== 'boolean') {
                acc.push(`Invalid 'public' value in route at index ${index}: ${route.public}`);
            }

            if (typeof route.pathFromRoot !== 'boolean') {
                acc.push(`Invalid 'pathFromRoot' value in route at index ${index}: ${route.pathFromRoot}`);
            }

            if (!Array.isArray(route.globalMiddlewares)) {
                acc.push(`Invalid 'globalMiddlewares' value in route at index ${index}: ${route.globalMiddlewares}`);
            }

            if (!Array.isArray(route.middlewares)) {
                acc.push(`Invalid 'middlewares' value in route at index ${index}: ${route.middlewares}`);
            }

            return acc;
        }, []);

        if (warnings.length > 0) {
            console.warn('\n');
            warnings.forEach(warning => {
                const index = parseInt(warning.match(/\d+/)[0]); 
                const route = jsonData[index];
                if (route) {
                    console.warn(`${colors.yellow}[Error]: ${warning}         [Module]: ${folderName}       [API]: ${route.path}${colors.reset} \n`);
                }
            });
            console.warn(`\n${colors.yellow}Server will not start due to warnings.${colors.reset}`);
        } else {
            const PORT = 3000;
            app.get ("/", middlewares, function (req, res){home(req,res)})
            app.get ("/signup", middlewares, function (req, res){signup(req,res)})
            app.get ("/login", middlewares, function (req, res){login(req,res)})
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    } catch (Error) {
        console.error(`${colors.red}Error parsing JSON:${colors.reset}`, Error);
    }
});

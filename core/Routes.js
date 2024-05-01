const path = require('path');
const fs = require('fs');

    const routes = {};
    const modulesPath = path.join(__dirname, '../api');
    const moduleDirectories = fs.readdirSync(modulesPath);
    moduleDirectories.forEach(moduleDir => {
        const modulePath = path.join(modulesPath, moduleDir);
        const routesPath = path.join(modulePath, 'controllers');
        const routesFiles = fs.readdirSync(routesPath);
        routes[moduleDir] = {}
        routesFiles.forEach(file => {
            if (file.endsWith('.js')) {
                const routeName = path.basename(file, '.js');
                const routeModule = require(path.join(routesPath, file));
                routes[moduleDir][routeName] = routeModule ;
            }
        });
    });


module.exports = routes;

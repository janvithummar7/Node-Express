const path = require('path');
const fs = require('fs');

    const services = {};
    const modulesPath = path.join(__dirname, '../api');
    const moduleDirectories = fs.readdirSync(modulesPath);
    moduleDirectories.forEach(moduleDir => {
        const modulePath = path.join(modulesPath, moduleDir);
        const servicesPath = path.join(modulePath, 'services');
        const servicesFiles = fs.readdirSync(servicesPath);
        services[moduleDir] = {}
        servicesFiles.forEach(file => {
            if (file.endsWith('.js')) {
                const serviceName = path.basename(file, '.js');
                const serviceModule = require(path.join(servicesPath, file));
                services[moduleDir][serviceName] = serviceModule ;
            }
        });
    });


module.exports = services;

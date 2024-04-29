const path = require('path');
const fs = require('fs');

const framework = {
    services: {},
};

function getServices() {
    const modulesPath = path.join(__dirname, '../api');
    const moduleDirectories = fs.readdirSync(modulesPath);
    moduleDirectories.forEach(moduleDir => {
        const modulePath = path.join(modulesPath, moduleDir);
        const servicesPath = path.join(modulePath, 'services');
        const servicesFiles = fs.readdirSync(servicesPath);
        servicesFiles.forEach(file => {
            if (file.startsWith('test')) {
                const serviceName = path.basename(file, '.js');
                const serviceModule = require(path.join(servicesPath, file));
                framework.services[moduleDir] = { [serviceName]: serviceModule }
            }
        });
    });
}
getServices()

module.exports = framework;








module.exports = framework;

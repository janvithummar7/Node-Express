const path = require('path');
const fs = require('fs');

const framework = {
    services: {},
};

function loadServices(directoryPath, parentKey) {
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const key = parentKey ? `${file}` : file;
            framework.services[key] = {};
            loadServices(filePath, key); 
        } else if (stats.isFile() && path.extname(file) === '.js') {
            const serviceName = path.parse(file).name;
            const key = parentKey ? `${serviceName}` : serviceName;
            const service = require(filePath);
            framework.services[key] = service;
        }
    });
}

loadServices(path.join(__dirname, '../api'), 'services');

module.exports = framework;

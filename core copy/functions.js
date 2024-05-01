const path = require('path');
const fs = require('fs');

    const functions = {};
    const modulesPath = path.join(__dirname, '../api');
    const moduleDirectories = fs.readdirSync(modulesPath);
    moduleDirectories.forEach(moduleDir => {
        const modulePath = path.join(modulesPath, moduleDir);
        const functionsPath = path.join(modulePath, 'functions');
        const functionsFiles = fs.readdirSync(functionsPath);
        functions[moduleDir] = {}
        functionsFiles.forEach(file => {
            if (file.endsWith('.js')) {
                const functionsName = path.basename(file, '.js');
                const functionModule = require(path.join(functionsPath, file));
                functions[moduleDir][functionsName] = functionModule ;
            }
        });
    });


module.exports = functions;

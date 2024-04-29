const express = require('express');
const { ErrorHandling, Routes } = require('./core/ErrorHandling');

const app = express();
const PORT = 3000;

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m'
};

ErrorHandling((err, warnings, err_msg, folderName, jsonData) => {
    if (err) {
        console.error(`${colors.red}Error : ${err}${colors.reset}`);
        return;
    }

    if (err_msg.length > 0) {
        console.warn('\n');
        err_msg.forEach(err => {
            const index = parseInt(err.match(/\d+/)[0]); 
            const route = jsonData[index];
            if (route) {
                console.warn(`${colors.red}[Error]: ${err} [Module]: ${folderName} [API]: ${route.path}${colors.reset}\n`);
            }
        });
        console.warn(`\n${colors.yellow}Server will start with errors.${colors.reset}`);
    }

    if (warnings.length > 0) {
        console.warn('\n');
        warnings.forEach(warning => {
            const index = parseInt(warning.match(/\d+/)[0]); 
            const route = jsonData[index];
            if (route) {
                console.warn(`${colors.yellow}[Warning]: ${warning} [Module]: ${folderName} [API]: ${route.path}${colors.reset}\n`);
            }
        });
        console.warn(`\n${colors.yellow}Server will start with warnings.${colors.reset}`);
    }

    Routes(app, jsonData.filter((route, index) => !err_msg.some(msg => msg.includes(`index ${index}`))));
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

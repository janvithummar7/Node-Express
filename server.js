const express = require('express');
const { ErrorHandling, Routes } = require('./core/ErrorHandling');

const app = express();
const PORT = 3000;

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m'
};

ErrorHandling((err, warnings, folderName, jsonData) => {
    if (err) {
        console.error(`${colors.red}Error : ${err}${colors.reset}`);
        return;
    }

    if (warnings.length > 0) {
        console.warn('\n');
        warnings.forEach(warning => {
            const index = parseInt(warning.match(/\d+/)[0]); 
            const route = jsonData[index];
            if (route) {
                console.warn(`${colors.yellow}[Error]: ${warning} [Module]: ${folderName} [API]: ${route.path}${colors.reset}\n`);
            }
        });
        console.warn(`\n${colors.yellow}Server will not start due to warnings.${colors.reset}`);
    } else {
        Routes(app); // Setup routes
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
});

const express = require('express');
const NoError = require('./core/ErrorHandling');
const routes = require('./api/auth/services/routes');

const PORT = 3000;
const app = express();

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m'
};

NoError((err, warnings, folderName, jsonData) => {
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
        routes(app)
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
});

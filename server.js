const express = require('express');
const { home, signup, login } = require('./api/auth/controllers/pageControllers');
const middlewares = require('./api/auth/middleware/authMiddleware');
const NoError = require('./core/ErrorHandling');

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
        app.get("/", middlewares, (req, res) => { home(req, res) });
        app.get("/signup", middlewares, (req, res) => { signup(req, res) });
        app.get("/login", middlewares, (req, res) => { login(req, res) });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
});

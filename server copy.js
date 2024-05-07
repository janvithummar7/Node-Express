require('dotenv').config();
const express = require('express');
const services  = require('./core/services');
const crons = require('./core/crons')
const functions = require('./core/functions')
const {Routes} = require('./core/routes')

const framework = {
    services: services,
    crons: crons,
    functions: functions,
};
global.framework = framework;

const app = express();
const PORT = 3000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
Routes(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(`Error setting up routes:`, error);
});
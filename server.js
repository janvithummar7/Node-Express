const express = require('express');
const services  = require('./core/services');
const crons = require('./core/crons')
const functions = require('./core/functions')
const {routes, startServer} = require('./core/routes')

const framework = {
    services: services,
    crons: crons,
    functions: functions,
    routes: routes,
};
global.framework = framework;

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(startServer)
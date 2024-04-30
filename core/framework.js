const path = require('path');
const fs = require('fs');
const services  = require('./services');
const crons = require('./crons')
const functions = require('./functions')

const framework = {
    services: services,
    crons: crons,
    functions: functions,
};


module.exports = framework;

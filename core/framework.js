const path = require('path');
const fs = require('fs');
const services  = require('./services');
const crons = require('./crons')

const framework = {
    services: services,
    crons: crons,
};


module.exports = framework;

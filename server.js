require("dotenv").config();
const express = require("express");
const { Routes } = require("./core/routes");
const services = require("./core/services");
const functions = require("./core/functions");
const { db, sequelize } = require("./core/model");
const sequelizeModel = require("./core/sequelizeModel");
const mongoDBModel = require('./core/mongodbModel');
const mongodbConncetion = require("./db/mongodb/connection/connection");
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer() {
  try {
    await Routes(app);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error setting up routes or starting server:", error);
    process.exit(1);
  }
}

async function initializeApp() {
  try {
    const crons = await require("./core/crons");

    const framework = {
      services: services,
      crons: crons,
      functions: functions,
      models: db,
      sequelizeConnection: sequelize,
      sequelize: sequelizeModel,
      mongo: mongoDBModel,
      mongodbConncetion: mongodbConncetion
    };
    global.framework = framework;
    // console.log(framework,"<---------------framework");
    const { checkPendingMigrations } = require("./core/migrations");
    await checkPendingMigrations();
    await startServer();
  } catch (error) {
    console.error("App initialization error:", error);
    process.exit(1);
  }
}

// initializeApp();

module.exports = initializeApp;

require('dotenv').config();
const express = require('express');
const readline = require('readline');
const { Sequelize, DataTypes } = require('sequelize');
const { Routes } = require('./core/routes');
const services = require('./core/services');
const crons = require('./core/crons');
const functions = require('./core/functions');
const fs = require('fs').promises;

const framework = {
  services: services,
  crons: crons,
  functions: functions,
};
global.framework = framework;

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sequelize = new Sequelize({
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT
});

const SequelizeMeta = sequelize.define('sequelizemeta', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
}, {
  tableName: 'sequelizemeta',
  timestamps: false
});

async function checkPendingMigrations() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await SequelizeMeta.sync();

    const executedMigrations = await SequelizeMeta.findAll({ attributes: ['name'] });

    const migrationFiles = await fs.readdir('./db/migrations');

    const jsMigrationFiles = migrationFiles.filter(file => file.endsWith('.js'));

    const pendingMigrations = jsMigrationFiles.filter((migration) => {
      const migrationName = migration.replace(/^.*[\\\/]/, '');
      return !executedMigrations.some((executed) => executed.name === migrationName);
    });

    if (pendingMigrations.length > 0) {
        const answer = await askUser('Found pending migrations. Do you want to run them? (yes/no) ');
        if (answer.toLowerCase() === 'yes') {
          console.log('Running pending migrations...');
          await runMigrations(pendingMigrations);
        } else {
          console.log('Skipping migrations.');
        }
      } else {
        console.log('No pending migrations.');
      }
    } catch (error) {
      console.error('Error checking or running migrations:', error);
      throw error;
    }
}

async function askUser(question) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise(resolve => {
      rl.question(question, answer => {
        rl.close();
        resolve(answer);
      });
    });
  }

  async function runMigrations(migrationFiles) {
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelize.query('START TRANSACTION');
  
      for (const migration of migrationFiles) {
        const migrationName = migration.replace(/^.*[\\\/]/, '');
        await SequelizeMeta.create({ name: migrationName });
        const migrationModule = require(`./db/migrations/${migration}`);
        await migrationModule.up(sequelize.getQueryInterface());
      }
  
      await sequelize.query('COMMIT');
      console.log('Migrations completed successfully.');
    } catch (error) {
      console.error('Error running migrations:', error);
      await sequelize.query('ROLLBACK');
      throw error;
    }
  }

  async function startServer() {
    try {
      await Routes(app);
  
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Error setting up routes or starting server:', error);
      process.exit(1);
    }
  }
  

  async function initializeApp() {
    try {
      await checkPendingMigrations();
      await startServer();
    } catch (error) {
      console.error('App initialization error:', error);
      process.exit(1);
    }
  }
  
  // Initialize the application
  initializeApp();
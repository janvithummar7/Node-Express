const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

require('dotenv').config();
const express = require('express');
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

// Sequelize configuration
const sequelize = new Sequelize({
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT
});

// Define Sequelize model for SequelizeMeta table (if not already defined)
const SequelizeMeta = sequelize.define('SequelizeMeta', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
}, {
  tableName: 'SequelizeMeta',
  timestamps: false
});

// Function to check for pending migrations
async function checkPendingMigrations() {
  try {
    // Authenticate with the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Synchronize SequelizeMeta model with database schema
    await SequelizeMeta.sync();

    // Get list of executed migration names from SequelizeMeta table
    const executedMigrations = await SequelizeMeta.findAll({ attributes: ['name'] });

    // Read migration files from the directory
    const migrationFiles = await fs.readdir('./db/migrations');

    // Filter out non-JavaScript files (if needed)
    const jsMigrationFiles = migrationFiles.filter(file => file.endsWith('.js'));

    // Filter out executed migrations
    const pendingMigrations = jsMigrationFiles.filter((migration) => {
      const migrationName = migration.replace(/^.*[\\\/]/, ''); // Extract filename from path
      return !executedMigrations.some((executed) => executed.name === migrationName);
    });

    if (pendingMigrations.length > 0) {
      console.log(`Found ${pendingMigrations.length} pending migration(s).`);

      // Prompt user to migrate pending models
      rl.question('Do you want to migrate pending models? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          console.log('Running migrations...');
          await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
          await sequelize.query('START TRANSACTION');
          for (const migration of pendingMigrations) {
            await SequelizeMeta.create({ name: migration }); // Mark migration as executed
            const migrationModule = require(`./db/migrations/${migration}`); // Load migration file
            await migrationModule.up(sequelize.getQueryInterface()); // Apply migration
          }
          await sequelize.query('COMMIT');
          console.log('Migrations completed successfully.');
          startServer(); // Start server after migrations
        } else {
          console.log('Skipping migrations.');
          startServer(); // Start server without migrating
        }
        rl.close();
      });
    } else {
      console.log('No pending migrations.');
      startServer(); // Start server directly
    }
  } catch (error) {
    console.error('Error occurred while checking or running migrations:', error);
    throw error;
  }
}

// Function to start the server and set up routes
async function startServer() {
  try {
    // Setup routes
    await Routes(app);
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error setting up routes or starting server:', error);
    process.exit(1); // Exit the process with a non-zero status code on error
  }
}

// Start the server after checking for pending migrations
checkPendingMigrations()
  .catch((error) => {
    console.error('Error checking or running migrations:', error);
    process.exit(1); // Exit the process with a non-zero status code on error
  });

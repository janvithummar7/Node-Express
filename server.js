require('dotenv').config();
const express = require('express');
const readline = require('readline');
const { Sequelize, DataTypes } = require('sequelize');
const { Routes } = require('./core/routes');
const services = require('./core/services');
const crons = require('./core/crons');
const functions = require('./core/functions');
const { log } = require('console');
const fs = require('fs').promises;
const Umzug = require('umzug');
const path = require('path');
// const fg = require('fast-glob');


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
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  });


async function checkPendingMigrations() {
  try {


    var umzug = new Umzug({
        storage: 'sequelize',
          storageOptions: {
              sequelize: sequelize // here should be a sequelize instance, not the Sequelize module
          },
        migrations: {
            // The params that gets passed to the migrations.
            // Might be an array or a synchronous function which returns an array.
            params: [sequelize.getQueryInterface(), sequelize.constructor, function() {
              throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
            }],
            path: path.join(__dirname, 'db', 'migrations')
        }
      });      

    
    // const umzug = new Umzug({
    //     migrations: {
    //         glob: './db/migrations/*'
    //         // glob: await fg(['./db/migrations/*'])
    //         // path: path.join(__dirname, 'db', 'migrations')
    //     },
    //     storage: new SequelizeStorage({ sequelize }),
    //     logger: console     
    //   });
      const pendingMigrations = await umzug.pending();
      console.log(pendingMigrations, ' : pendingMigrations');
      const migrations = await umzug.executed()
      console.log(migrations);


      if (pendingMigrations.length > 0) {
        console.log('Found pending migrations:');
        pendingMigrations.forEach(migration => {
          console.log(`- ${migration.file}`);
        });
  
             
        await sequelize.authenticate()
            .then(() => {
                console.log('Database connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
        const answer = await askUser('\nDo you want to run them? (y/n) ');
   


        if (answer.toLowerCase() === 'y') {
          console.log('Running pending migrations...');
          await umzug.up();
          console.log('Migrations executed successfully.');
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
  
  initializeApp();
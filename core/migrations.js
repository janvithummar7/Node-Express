const readline = require('readline');
const  Sequelize = require('sequelize');
const Umzug = require('umzug');
const path = require('path');
const sequelize = framework.connection;


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
              path: path.join(__dirname, '../db', 'migrations')
          }
        });      
  
        const pendingMigrations = await umzug.pending();
        const migrations = await umzug.executed()
  
  
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
  
  module.exports = {checkPendingMigrations}
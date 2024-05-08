const fs = require('fs');
const path = require('path');
const db = require('./model')

const models = {};
const modelsPath = path.join(__dirname, '../db/models');

fs.readdirSync(modelsPath).forEach(file => {
  const filePath = path.join(modelsPath, file);

  if (fs.statSync(filePath).isDirectory() || file === 'index.js') {
    return;
  }

  const modelName = path.basename(file, '.js');
//   models[modelName] = modelName;
    models[modelName] = db.db[modelName]
  console.log(db.db[modelName])
 
});
console.log(models)
console.log(db.db.students)


module.exports = models;

const fs = require("fs");
const path = require("path");

const sequelizeModel = {};
const modelPath = path.join(__dirname, "../db/sequelize/models");

const modelFiles = fs.readdirSync(modelPath);
modelFiles.forEach((file) => {
  if (file.endsWith(".js")) {
    const sequelizeModelName = path.basename(file, ".js");
    const sequelizeModule = require(path.join(modelPath, file));
    if (!sequelizeModel.models) {
      sequelizeModel.models = {};
    }
    sequelizeModel.models[sequelizeModelName] = sequelizeModule;
  }
});

module.exports = sequelizeModel;

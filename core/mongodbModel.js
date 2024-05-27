const fs = require("fs");
const path = require("path");

const mongoDBModel = {};
const modelPath = path.join(__dirname, "../db/mongodb/models");

const modelFiles = fs.readdirSync(modelPath);
modelFiles.forEach((file) => {
  if (file.endsWith(".js")) {
    const mongoDBModelName = path.basename(file, ".js");
    const mongoDBModule = require(path.join(modelPath, file));
    if (!mongoDBModel.models) {
        mongoDBModel.models = {};
    }
    mongoDBModel.models[mongoDBModelName] = mongoDBModule;
  }
});


module.exports = mongoDBModel;

"use strict";

import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const basename = _basename(__filename);
const env = process.env.NODE_ENV || "development";
// Use dynamic import or require depending on environment
const config = require("../config/config.js")[env];

const db = {};

console.log(`Connecting to database: ${config.database} on ${config.host} as ${config.username}`);

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

sequelize.authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

const files = readdirSync(__dirname);
console.log(`Found ${files.length} files in models directory`);

files
  .filter((file) => {
    const isTrue =
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
    return isTrue;
  })
  .forEach((file) => {
    try {
      const modelPath = join(__dirname, file);
      const model = sequelize.import(modelPath);
      if (model && model.name) {
        db[model.name] = model;
        console.log(`Loaded model: ${model.name}`);
      } else {
        console.warn(`Model at ${file} does not have a name or failed to load.`);
      }
    } catch (error) {
      console.error(`Error loading model from ${file}:`, error);
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;

"use strict";

import { readdirSync } from "fs";
import { basename as _basename, join, dirname } from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import dbConfig from "../config/config.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

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

// Use an async function to load modules
const initializeModels = async () => {
  for (const file of files) {
    if (file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js") {
      try {
        const modelPath = "./" + file; // Use relative path for import
        const modelModule = await import(modelPath);
        // Note: Models are expected to be default exports from each file
        const model = modelModule.default(sequelize, Sequelize.DataTypes);
        if (model && model.name) {
          db[model.name] = model;
          console.log(`Loaded model: ${model.name}`);
        }
      } catch (error) {
        console.error(`Error loading model from ${file}:`, error);
      }
    }
  }

  // Set up associations
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

// Initial model load
await initializeModels();

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;
export { sequelize, Sequelize };

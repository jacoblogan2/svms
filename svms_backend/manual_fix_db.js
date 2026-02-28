require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize(
  process.env.DEV_DATABASE_NAME,
  process.env.DEV_DATABASE_USER,
  process.env.DEV_DATABASE_PASSWORD,
  {
    host: process.env.DEV_DATABASE_HOST,
    port: process.env.DEV_DATABASE_PORT,
    dialect: "postgres",
  }
);

async function fix() {
  const result = [];
  try {
    result.push("Starting manual db fix...");
    
    // Check if Villages exists
    try {
        await sequelize.query('SELECT 1 FROM "Villages" LIMIT 1');
        result.push('Table "Villages" already exists.');
    } catch (e) {
        result.push('Table "Villages" missing, creating it...');
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "Villages" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "townId" INTEGER REFERENCES "Towns" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
            );
        `);
        result.push('Table "Villages" created successfully.');
        
        // Add to SequelizeMeta if not there
        const [meta] = await sequelize.query('SELECT * FROM "SequelizeMeta" WHERE name = \'zzzzzz20231208145629-create-Villages.js\'');
        if (meta.length === 0) {
            await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES (\'zzzzzz20231208145629-create-Villages.js\')');
            result.push('Added zzzzzz20231208145629-create-Villages.js to SequelizeMeta.');
        }
    }
    
    // Ensure "Comments" exists as well since zzzzzz20231208145639-create-comment.js was missing
    try {
        await sequelize.query('SELECT 1 FROM "Comments" LIMIT 1');
        result.push('Table "Comments" already exists.');
    } catch (e) {
        result.push('Table "Comments" missing, creating it...');
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "Comments" (
                "id" SERIAL PRIMARY KEY,
                "userID" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
                "postID" INTEGER REFERENCES "Posts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
                "comment" TEXT NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
            );
        `);
        result.push('Table "Comments" created successfully.');
        
        if (true) {
             await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES (\'zzzzzz20231208145639-create-comment.js\')');
             result.push('Added zzzzzz20231208145639-create-comment.js to SequelizeMeta.');
        }
    }

  } catch (error) {
    result.push(`FIX ERROR: ${error.message}`);
    result.push(error.stack);
  } finally {
    fs.writeFileSync('manual_fix_out.txt', result.join('\n'));
    process.exit(0);
  }
}

fix();

require('dotenv').config();
const { Sequelize } = require('sequelize');
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
    result.push("Renaming cellId to townId in Villages...");
    
    // Check if cellId exists
    const [cols] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Villages' AND column_name = 'cellId'");
    if (cols.length > 0) {
        await sequelize.query('ALTER TABLE "Villages" RENAME COLUMN "cellId" TO "townId"');
        result.push("Column cellId renamed to townId successfully.");
    } else {
        result.push("Column cellId NOT found in Villages (maybe already renamed).");
    }

  } catch (error) {
    result.push(`RENAME ERROR: ${error.message}`);
    result.push(error.stack);
  } finally {
    fs.writeFileSync('rename_col_out.txt', result.join('\n'));
    process.exit(0);
  }
}

fix();

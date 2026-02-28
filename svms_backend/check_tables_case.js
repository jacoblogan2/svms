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

async function check() {
  const result = [];
  try {
    const tables = ["Users", "users", "Counties", "counties", "Districts", "districts", "Clans", "clans", "Towns", "towns", "Villages", "villages"];
    for (const table of tables) {
      try {
        await sequelize.query(`SELECT 1 FROM "${table}" LIMIT 1`);
        result.push(`Table [${table}] exists (case sensitive)`);
      } catch (e) {
        try {
          await sequelize.query(`SELECT 1 FROM ${table} LIMIT 1`);
          result.push(`Table [${table}] exists (case insensitive)`);
        } catch (e2) {
          result.push(`Table [${table}] DOES NOT exist`);
        }
      }
    }
  } catch (error) {
    result.push(`ERROR: ${error.message}`);
  } finally {
    fs.writeFileSync('table_check_out.txt', result.join('\n'));
    process.exit(0);
  }
}
check();

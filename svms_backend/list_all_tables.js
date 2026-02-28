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

async function list() {
  try {
    const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    const tables = results.map(r => r.table_name);
    fs.writeFileSync('all_tables_list.txt', tables.join('\n'));
  } catch (error) {
    fs.writeFileSync('all_tables_list.txt', "ERROR: " + error.message);
  }
  process.exit(0);
}
list();

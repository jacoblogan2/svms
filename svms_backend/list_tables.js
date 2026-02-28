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

async function test() {
  try {
    const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    const tables = results.map(r => r.table_name).join('\n');
    fs.writeFileSync('tables_out.txt', "Tables:\n" + tables);
  } catch(e) {
    fs.writeFileSync('tables_out.txt', "ERROR: " + e.message);
  }
  process.exit(0);
}
test();

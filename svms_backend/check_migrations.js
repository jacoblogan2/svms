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
  try {
    const [results] = await sequelize.query('SELECT name FROM "SequelizeMeta" ORDER BY name ASC');
    fs.writeFileSync('migrations_list.txt', results.map(r => r.name).join('\n'));
  } catch (error) {
    fs.writeFileSync('migrations_list.txt', "ERROR: " + error.message);
  }
  process.exit(0);
}
check();

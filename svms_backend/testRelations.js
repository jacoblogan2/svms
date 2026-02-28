require('dotenv').config();
const { Sequelize } = require('sequelize');

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
  let output = "";
  for (const table of ["Counties", "Districts", "Clans", "Towns", "Villages"]) {
    try {
      await sequelize.query(`SELECT * FROM "${table}" LIMIT 1`);
      output += `${table} table EXISTS.\n`;
    } catch(e) {
      output += `${table} ERROR: ` + e.message + "\n";
    }
  }
  require('fs').writeFileSync('db_output2.txt', output);
}
test();

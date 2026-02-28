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
  try {
    const [results] = await sequelize.query('SELECT * FROM "Users" LIMIT 1');
    require('fs').writeFileSync('db_output.txt', JSON.stringify(results[0], null, 2) || "No users found.");
    console.log("Success");
  } catch(e) {
    require('fs').writeFileSync('db_output.txt', "ERROR: " + e.message);
    console.log("Error caught and written to db_output.txt");
  }
}
test();

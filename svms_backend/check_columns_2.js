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
     const [results] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Clans'");
     result.push("Columns in Clans:");
     result.push(JSON.stringify(results, null, 2));
     
     const [results2] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Districts'");
     result.push("Columns in Districts:");
     result.push(JSON.stringify(results2, null, 2));

  } catch (error) {
    result.push(`ERROR: ${error.message}`);
  } finally {
    fs.writeFileSync('column_check_2_out.txt', result.join('\n'));
    process.exit(0);
  }
}
check();

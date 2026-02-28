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
    const [results] = await sequelize.query("SELECT n.nspname as schema, c.relname as table FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname ILIKE '%village%'");
    result.push("Results for %village%:");
    result.push(JSON.stringify(results, null, 2));
    
    const [results2] = await sequelize.query("SELECT n.nspname as schema, c.relname as table FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname ILIKE '%village%'");
    // wait, same query.
    
    const [results3] = await sequelize.query("SELECT n.nspname as schema, c.relname as table FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind = 'r' AND n.nspname NOT IN ('pg_catalog', 'information_schema')");
    result.push("All User Tables:");
    result.push(JSON.stringify(results3, null, 2));

  } catch (error) {
    result.push(`ERROR: ${error.message}`);
  } finally {
    fs.writeFileSync('table_find_out.txt', result.join('\n'));
    process.exit(0);
  }
}
check();

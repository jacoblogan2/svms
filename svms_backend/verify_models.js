import db from "./src/database/models/index.js";
const fs = require('fs');

async function verify() {
  const result = [];
  try {
    result.push("Starting model verification...");
    const modelNames = Object.keys(db).filter(k => k !== 'Sequelize' && k !== 'sequelize');
    result.push(`Loaded models: ${modelNames.join(', ')}`);
    
    // Test a simple query to ensure connection works
    if (db.Counties) {
        const count = await db.Counties.count();
        result.push(`Counties count: ${count}`);
    } else {
        result.push("ERROR: Counties model not found in db object");
    }
  } catch (error) {
    result.push(`FATAL ERROR: ${error.message}`);
    result.push(error.stack);
  } finally {
    fs.writeFileSync('verify_models_out.txt', result.join('\n'));
    process.exit(0);
  }
}

verify();

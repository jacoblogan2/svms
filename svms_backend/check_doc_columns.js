
import db from "./src/database/models/index.js";
const { Documents } = db;

async function checkDocColumns() {
  try {
    const doc = await Documents.findOne();
    if (doc) {
      console.log("Document data found. Keys:");
      console.log(Object.keys(doc.dataValues));
    } else {
      console.log("No document found to check columns.");
      // Just check the attributes of the model
      console.log("Model attributes:");
      console.log(Object.keys(Documents.rawAttributes));
    }
    process.exit(0);
  } catch (error) {
    console.error("Error checking doc columns:");
    console.error(error);
    process.exit(1);
  }
}

checkDocColumns();

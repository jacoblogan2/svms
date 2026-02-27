
import db from "./src/database/models/index.js";
const { Users } = db;

async function checkColumns() {
  try {
    const user = await Users.findOne();
    if (user) {
      console.log("User data found. Keys:");
      console.log(Object.keys(user.dataValues));
    } else {
      console.log("No user found to check columns.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error checking columns:");
    console.error(error);
    process.exit(1);
  }
}

checkColumns();

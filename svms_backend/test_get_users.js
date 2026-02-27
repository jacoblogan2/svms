
import { getUsers } from "./src/services/userService.js";

async function testGetUsers() {
  try {
    console.log("Attempting to fetch users...");
    const users = await getUsers();
    console.log(`Successfully fetched ${users.length} users.`);
    process.exit(0);
  } catch (error) {
    console.error("Caught error in getUsers test:");
    console.error(error);
    process.exit(1);
  }
}

testGetUsers();

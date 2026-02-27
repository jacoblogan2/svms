
import db from "./src/database/models/index.js";
const { Counties, Districts, Clans, Towns, Villages } = db;

async function checkData() {
  try {
    const villageCount = await Villages.count();
    const townCount = await Towns.count();
    console.log(`Town count: ${townCount}`);
    console.log(`Village count: ${villageCount}`);

    const towns = await Towns.findAll({ limit: 10 });
    console.log("First 10 towns:");
    towns.forEach(t => console.log(`- ${t.name} (ID: ${t.id}, ClanID: ${t.clanId})`));

    const villages = await Villages.findAll({ limit: 10 });
    console.log("First 10 villages:");
    villages.forEach(v => console.log(`- ${v.name} (ID: ${v.id}, TownID: ${v.townId})`));

    process.exit(0);
  } catch (error) {
    console.error("Error checking data:", error);
    process.exit(1);
  }
}

checkData();

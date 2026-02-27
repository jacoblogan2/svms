
import { seedAddressData } from "./src/controllers/addressController.js";
import db from "./src/database/models/index.js";
const { Villages, Towns } = db;

async function runSeed() {
  try {
    console.log("Starting address seeding...");
    await seedAddressData();
    console.log("Seeding finished.");

    const townCount = await Towns.count();
    const villageCount = await Villages.count();
    console.log(`Verified Town count: ${townCount}`);
    console.log(`Verified Village count: ${villageCount}`);

    if (villageCount > 0) {
      const sampleVillages = await Villages.findAll({ limit: 5 });
      console.log("Sample Villages:");
      sampleVillages.forEach(v => console.log(`- ${v.name} (TownID: ${v.townId})`));
    }

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

runSeed();

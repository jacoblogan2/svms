import db from "./src/database/models/index.js";
const { Users, Counties, Districts, Clans, Towns, Villages } = db;

async function test() {
  console.log("Starting test...");
  try {
    const data = await Users.findAll({
      where: { role: "citizen" },
      attributes: { exclude: ["password"] },
      include: [
        { model: Counties, as: "county" },
        { model: Districts, as: "district" },
        { model: Clans, as: "clan" },
        { model: Towns, as: "town" },
        { model: Villages, as: "village" },
      ],
    });
    console.log("Length:", data.length);
  } catch (err) {
    console.error("EXACT ERROR:", err.message);
    if(err.sql) console.error("SQL:", err.sql);
  }
  process.exit();
}
test();

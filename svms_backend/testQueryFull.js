require('dotenv').config();
const { Sequelize, DataTypes, Model } = require('sequelize');

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

class Counties extends Model {}
Counties.init({ name: DataTypes.STRING }, { sequelize, modelName: "Counties" });

class Districts extends Model {}
Districts.init({ name: DataTypes.STRING, countyId: DataTypes.INTEGER }, { sequelize, modelName: "Districts" });

class Clans extends Model {}
Clans.init({ name: DataTypes.STRING, districtId: DataTypes.INTEGER }, { sequelize, modelName: "Clans" });

class Towns extends Model {}
Towns.init({ name: DataTypes.STRING, clanId: DataTypes.INTEGER }, { sequelize, modelName: "Towns" });

class Villages extends Model {}
Villages.init({ name: DataTypes.STRING, townId: DataTypes.INTEGER }, { sequelize, modelName: "Villages" });

class Users extends Model {}
Users.init({ 
  role: DataTypes.ENUM("county_leader", "district_leader", "clan_leader", "town_leader", "village_leader", "admin", "citizen"),
  county_id: DataTypes.INTEGER, district_id: DataTypes.INTEGER, clan_id: DataTypes.INTEGER, town_id: DataTypes.INTEGER, village_id: DataTypes.INTEGER,
  password: DataTypes.STRING 
}, { sequelize, modelName: "Users" });

Users.belongsTo(Counties, { foreignKey: "county_id", as: "county" });
Users.belongsTo(Districts, { foreignKey: "district_id", as: "district" });
Users.belongsTo(Clans, { foreignKey: "clan_id", as: "clan" });
Users.belongsTo(Towns, { foreignKey: "town_id", as: "town" });
Users.belongsTo(Villages, { foreignKey: "village_id", as: "village" });

async function test() {
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
    require('fs').writeFileSync('query_output.txt', "SUCCESS! Length: " + data.length);
  } catch(e) {
    require('fs').writeFileSync('query_output.txt', "ERROR: " + String(e) + "\n" + (e.sql || ""));
  }
}
test();

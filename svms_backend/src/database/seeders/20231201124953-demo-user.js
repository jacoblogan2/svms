'use strict';
const bcrypt = require("bcryptjs"); // Use bcryptjs to match your userService.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;
    // We are hashing the password HERE so the DB gets the hash
    const hashedPasswordAdmin = await bcrypt.hash("Password@123", saltRounds);

    return queryInterface.bulkInsert("Users", [
      {
        firstname: "Jacob",
        lastname: "Logan",
        email: "jac@gmail.com",
        password: hashedPasswordAdmin, // This will now be a hash string
        phone: "0791701099",
        role: "admin",
        status: "active",
        gender: "Male",
        county_id: null,
        district_id: null,
        clan_id: null,
        town_id: null,
        village_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", { email: "jac@gmail.com" }, {});
  }
};
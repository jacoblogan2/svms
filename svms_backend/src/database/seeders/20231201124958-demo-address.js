"use strict";
import addressData from "../../address"; // Adjust path to where your data is located

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      for (const countyName in addressData) {
        // Check if county exists
        const [county] = await queryInterface.sequelize.query(
          `SELECT id FROM "Counties" WHERE name = :name`,
          {
            replacements: { name: countyName },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        let countyId = county ? county.id : null;

        // Insert county if it doesn't exist
        if (!countyId) {
          const countiesInserted = await queryInterface.bulkInsert(
            "Counties",
            [
              {
                name: countyName,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            { returning: true }
          );
          countyId = countiesInserted[0].id;
        }

        for (const districtName in addressData[countyName]) {
          // Check if district exists
          const [district] = await queryInterface.sequelize.query(
            `SELECT id FROM "Districts" WHERE name = :name AND "countyId" = :countyId`,
            {
              replacements: { name: districtName, countyId },
              type: Sequelize.QueryTypes.SELECT,
            }
          );

          let districtId = district ? district.id : null;

          // Insert district if it doesn't exist
          if (!districtId) {
            const districtsInserted = await queryInterface.bulkInsert(
              "Districts",
              [
                {
                  name: districtName,
                  countyId,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
              { returning: true }
            );
            districtId = districtsInserted[0].id;
          }

          for (const clanName in addressData[countyName][districtName]) {
            // Check if clan exists
            const [clan] = await queryInterface.sequelize.query(
              `SELECT id FROM "Clans" WHERE name = :name AND "districtId" = :districtId`,
              {
                replacements: { name: clanName, districtId },
                type: Sequelize.QueryTypes.SELECT,
              }
            );

            let clanId = clan ? clan.id : null;

            // Insert clan if it doesn't exist
            if (!clanId) {
              const clansInserted = await queryInterface.bulkInsert(
                "Clans",
                [
                  {
                    name: clanName,
                    districtId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ],
                { returning: true }
              );
              clanId = clansInserted[0].id;
            }

            const clanTowns = addressData[countyName][districtName][clanName];

            if (clanTowns && typeof clanTowns === "object" && !Array.isArray(clanTowns)) {
              for (const townName in clanTowns) {
                // Check if town exists
                const [town] = await queryInterface.sequelize.query(
                  `SELECT id FROM "Towns" WHERE name = :name AND "clanId" = :clanId`,
                  {
                    replacements: { name: townName, clanId },
                    type: Sequelize.QueryTypes.SELECT,
                  }
                );

                let townId = town ? town.id : null;

                // Insert town if it doesn't exist
                if (!townId) {
                  const townsInserted = await queryInterface.bulkInsert(
                    "Towns",
                    [
                      {
                        name: townName,
                        clanId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      },
                    ],
                    { returning: true }
                  );
                  townId = townsInserted[0].id;
                }

                const villagesData = clanTowns[townName];

                if (Array.isArray(villagesData) && villagesData.length > 0) {
                  for (const villageName of villagesData) {
                    // Check if village exists
                    const [village] = await queryInterface.sequelize.query(
                      `SELECT id FROM "Villages" WHERE name = :name AND "townId" = :townId`,
                      {
                        replacements: { name: villageName, townId },
                        type: Sequelize.QueryTypes.SELECT,
                      }
                    );

                    if (!village) {
                      await queryInterface.bulkInsert("Villages", [
                        {
                          name: villageName,
                          townId,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        },
                      ]);
                    }
                  }
                }
              }
            } else if (Array.isArray(clanTowns)) {
                // Liberia 4 levels hierarchy
                for (const townName of clanTowns) {
                    const [town] = await queryInterface.sequelize.query(
                        `SELECT id FROM "Towns" WHERE name = :name AND "clanId" = :clanId`,
                        {
                          replacements: { name: townName, clanId },
                          type: Sequelize.QueryTypes.SELECT,
                        }
                    );
                    if (!town) {
                        await queryInterface.bulkInsert("Towns", [
                            {
                                name: townName,
                                clanId,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ]);
                    }
                }
            }
          }
        }
      }

      console.log("Seeding completed successfully.");
    } catch (error) {
      console.error("Error seeding address data:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Villages", null, {});
    await queryInterface.bulkDelete("Towns", null, {});
    await queryInterface.bulkDelete("Clans", null, {});
    await queryInterface.bulkDelete("Districts", null, {});
    await queryInterface.bulkDelete("Counties", null, {});
  },
};

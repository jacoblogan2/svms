import db from "../database/models/index.js";
const { Counties, Districts, Clans, Towns, Villages } = db;
const _addressDataRaw = require('../address.js'); // Import static address data
const addressData = _addressDataRaw.default || _addressDataRaw; // Handle ES module default export
import { getAllAddressData,getAddressData } from "../services/addressService.js";

export const seedAddressData = async () => {
  for (const countyName of Object.keys(addressData)) {
    // Check if county already exists
    let county = await Counties.findOne({ where: { name: countyName } });

    // Insert county if it doesn't exist
    if (!county) {
      county = await Counties.create({ name: countyName });
    }

    for (const districtName in addressData[countyName]) {
      // Check if district already exists
      let district = await Districts.findOne({
        where: { name: districtName, countyId: county.id }
      });

      // Insert district if it doesn't exist
      if (!district) {
        district = await Districts.create({
          name: districtName,
          countyId: county.id,
        });
      }

      for (const clanName of Object.keys(addressData[countyName][districtName])) {
        // Check if clan already exists
        let clan = await Clans.findOne({
          where: { name: clanName, districtId: district.id }
        });

        // Insert clan if it doesn't exist
        if (!clan) {
          clan = await Clans.create({
            name: clanName,
            districtId: district.id,
          });
        }

        const clanTowns = addressData[countyName][districtName][clanName];

        if (clanTowns && typeof clanTowns === 'object' && !Array.isArray(clanTowns)) {
          for (const [townName, villagesData] of Object.entries(clanTowns)) {
            // Check if town already exists
            let town = await Towns.findOne({
              where: { name: townName, clanId: clan.id }
            });

            if (!town) {
              town = await Towns.create({
                name: townName,
                clanId: clan.id,
              });
            }

            // Insert villages if towns exist and they have villages
            if (Array.isArray(villagesData) && villagesData.length > 0) {
              const villagesPromises = villagesData.map(async (villageName) => {
                const existingVillage = await Villages.findOne({
                  where: { name: villageName, townId: town.id },
                });

                if (!existingVillage) {
                  await Villages.create({
                    name: villageName,
                    townId: town.id,
                  });
                }
              });
              await Promise.all(villagesPromises);
            }
          }
        } else if (Array.isArray(clanTowns)) {
            const townPromises = clanTowns.map(async (townName) => {
                let town = await Towns.findOne({
                    where: { name: townName, clanId: clan.id }
                });
                if (!town) {
                    await Towns.create({
                        name: townName,
                        clanId: clan.id,
                    });
                }
            });
            await Promise.all(townPromises);
        }
      }
    }
  }
};

export const addressController = async (req, res) => {
    try {
      await seedAddressData();
      res.status(200).json({ message: "Address data inserted successfully!" });
    } catch (error) {
      console.error("Error inserting address data:", error);
      res.status(500).json({ message: "Error inserting address data", error });
    }
  };
  

export const getAddressHierarchy = async (req, res) => {
  try {
    const addressData = await getAllAddressData();
    return res.status(200).json({
      success: true,
      message: "Address hierarchy fetched successfully",
      data: addressData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching address data",
      error: error.message,
    });
  }
};


export const getFilteredAddressData = async (req, res) => {
  try {
    const { county, district, clan, town, village } = req.query;

    const filters = { county, district, clan, town, village };

    const addressData = await getAddressData(filters);

    if (!addressData.length) {
      return res.status(404).json({ message: "No address data found" });
    }

    return res.status(200).json(addressData);
  } catch (error) {
    console.error("Error fetching filtered address data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
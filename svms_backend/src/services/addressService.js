import db from "../database/models/index.js";
const { Counties, Districts, Clans, Towns, Villages,Categories,Users,Posts,Notifications} = db;

export const getAllAddressData = async () => {
  try {
    const counties = await Counties.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: Districts,
          as: "districts", // Alias for Districts
          attributes: ["id", "name"],
          include: [
            {
              model: Clans,
              as: "clans", // Alias for Clans
              attributes: ["id", "name"],
              include: [
                {
                  model: Towns,
                  as: "towns", // Alias for Towns
                  attributes: ["id", "name"],
                  include: [
                    {
                      model: Villages,
                      as: "villages", // Alias for Villages
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return counties;
  } catch (error) {
    console.error("Error fetching address data:", error);
    throw error;
  }
};

export const getAddressData = async (filters) => {
  try {
    const whereCondition = {};

    if (filters.county) {
      whereCondition.name = filters.county;
    }

    const counties = await Counties.findAll({
      attributes: ["id", "name"],
      where: whereCondition,
      include: [
        {
          model: Districts,
          as: "districts",
          attributes: ["id", "name"],
          where: filters.district ? { name: filters.district } : undefined,
          required: !!filters.district,
          include: [
            {
              model: Clans,
              as: "clans",
              attributes: ["id", "name"],
              where: filters.clan ? { name: filters.clan } : undefined,
              required: !!filters.clan,
              include: [
                {
                  model: Towns,
                  as: "towns",
                  attributes: ["id", "name"],
                  where: filters.town ? { name: filters.town } : undefined,
                  required: !!filters.town,
                  include: [
                    {
                      model: Villages,
                      as: "villages",
                      attributes: ["id", "name"],
                      where: filters.village ? { name: filters.village } : undefined,
                      required: !!filters.village,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return counties;
  } catch (error) {
    console.error("Error fetching address data:", error);
    throw error;
  }
};


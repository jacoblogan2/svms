import db from "../database/models/index.js";

const getModels = () => {
  const { Counties, Districts, Clans, Towns, Villages } = db;
  if (!Counties || !Districts || !Clans || !Towns || !Villages) {
    const missing = [];
    if (!Counties) missing.push("Counties");
    if (!Districts) missing.push("Districts");
    if (!Clans) missing.push("Clans");
    if (!Towns) missing.push("Towns");
    if (!Villages) missing.push("Villages");
    console.error(`Missing models in addressService: ${missing.join(", ")}`);
    throw new Error(`Database error: Missing address models (${missing.join(", ")})`);
  }
  return { Counties, Districts, Clans, Towns, Villages };
};

export const getAllAddressData = async () => {
  try {
    const { Counties, Districts, Clans, Towns, Villages } = getModels();
    
    const counties = await Counties.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: Districts,
          as: "districts",
          attributes: ["id", "name"],
          include: [
            {
              model: Clans,
              as: "clans",
              attributes: ["id", "name"],
              include: [
                {
                  model: Towns,
                  as: "towns",
                  attributes: ["id", "name"],
                  include: [
                    {
                      model: Villages,
                      as: "villages",
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
    const { Counties, Districts, Clans, Towns, Villages } = getModels();
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
    console.error("Error fetching address data with filters:", error);
    throw error;
  }
};

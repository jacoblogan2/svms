import db from "../database/models/index.js";

const { Reports, Users, Counties, Districts, Clans, Towns, Villages, FamilyMembers } = db;

export const createReport = async (reportData) => {
  return await Reports.create(reportData);
};

export const getReportsByScope = async (whereClause) => {
  return await Reports.findAll({
    where: whereClause,
    include: [
      { model: Users, as: "generator", attributes: ["firstname", "lastname", "role"] },
      { model: Counties, as: "county", attributes: ["name"] },
      { model: Districts, as: "district", attributes: ["name"] },
    ],
    order: [["createdAt", "DESC"]]
  });
};

export const getReportById = async (id) => {
  return await Reports.findByPk(id, {
    include: [
      { model: Users, as: "generator", attributes: ["firstname", "lastname", "role"] },
    ]
  });
};

/**
 * Aggregates statistics for a specific location scope
 */
export const aggregateLocationStats = async (scope) => {
  // Logic to gather counts for the report data
  const citizenCount = await Users.count({ where: { ...scope, role: 'citizen' } });
  const householdCount = await Users.count({ where: { ...scope, role: 'citizen' } }); // Simplified: each citizen is a household head for now
  const familyMemberCount = await FamilyMembers.count({ where: scope });
  
  // You could add more complex stats here (births/deaths in last month, etc.)
  
  return {
    population: citizenCount + familyMemberCount,
    citizens: citizenCount,
    households: householdCount,
    familyMembersTotal: familyMemberCount,
    timestamp: new Date()
  };
};

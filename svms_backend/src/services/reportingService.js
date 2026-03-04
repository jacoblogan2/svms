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
      { model: Clans, as: "clan", attributes: ["name"] },
      { model: Towns, as: "town", attributes: ["name"] },
      { model: Villages, as: "village", attributes: ["name"] },
    ],
    order: [["createdAt", "DESC"]]
  });
};

export const deleteReport = async (id, userId) => {
  const report = await Reports.findOne({ where: { id, generatedBy: userId } });
  if (!report) throw new Error("Report not found or unauthorized");
  await report.destroy();
  return true;
};

export const submitReport = async (id, userId, nextLevelRole) => {
  const report = await Reports.findOne({ where: { id, generatedBy: userId } });
  if (!report) throw new Error("Report not found or unauthorized");
  
  report.status = 'submitted';
  report.sentTo = nextLevelRole;
  await report.save();
  return report;
};

export const getReportById = async (id) => {
  return await Reports.findByPk(id, {
    include: [
      { model: Users, as: "generator", attributes: ["firstname", "lastname", "role"] },
      { model: Counties, as: "county", attributes: ["name"] },
      { model: Districts, as: "district", attributes: ["name"] },
      { model: Clans, as: "clan", attributes: ["name"] },
      { model: Towns, as: "town", attributes: ["name"] },
      { model: Villages, as: "village", attributes: ["name"] },
    ]
  });
};

/**
 * Aggregates statistics for a specific location scope
 */
export const aggregateLocationStats = async (scope, timeFilter = null) => {
  // Base where clause including time filter if provided
  const baseWhere = { ...scope };
  if (timeFilter && timeFilter.startDate && timeFilter.endDate) {
    baseWhere.createdAt = {
      [db.Sequelize.Op.between]: [timeFilter.startDate, timeFilter.endDate]
    };
  }

  // Basic Counts
  const citizens = await Users.count({ where: { ...baseWhere, role: 'citizen' } });
  const localLeaders = await Users.count({ 
    where: { ...baseWhere, role: { [db.Sequelize.Op.ne]: 'citizen', [db.Sequelize.Op.ne]: 'admin' } } 
  });
  const households = await Users.count({ where: { ...baseWhere, role: 'citizen' } });
  
  // Alive vs Deceased
  const familyMembersAlive = await FamilyMembers.count({ where: { ...baseWhere, status: 'Alive' } });
  const familyMembersDeceased = await FamilyMembers.count({ where: { ...baseWhere, status: 'Deceased' } });
  const totalFamily = familyMembersAlive + familyMembersDeceased;
  
  const totalPopulation = citizens + familyMembersAlive; // Excludes deceased

  // --- Demographic Aggregations ---
  
  // 1. Gender Split (Summing Users + FamilyMembers)
  const maleCitizens = await Users.count({ where: { ...baseWhere, role: 'citizen', gender: 'Male' } });
  const femaleCitizens = await Users.count({ where: { ...baseWhere, role: 'citizen', gender: 'Female' } });
  
  const maleFamily = await FamilyMembers.count({ where: { ...baseWhere, status: 'Alive', gender: 'Male' } });
  const femaleFamily = await FamilyMembers.count({ where: { ...baseWhere, status: 'Alive', gender: 'Female' } });
  
  const totalMale = maleCitizens + maleFamily;
  const totalFemale = femaleCitizens + femaleFamily;

  // 2. Age Demographics (Kids vs Adults)
  // Determine date 18 years ago
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  // We assume Citizens/Household heads are Adults.
  // We only check FamilyMembers for Kids.
  const kidsCount = await FamilyMembers.count({
    where: {
      ...baseWhere,
      status: 'Alive',
      dob: { [db.Sequelize.Op.gt]: eighteenYearsAgo } // DOB is strictly greater than 18 yrs ago
    }
  });
  
  const adultsCount = totalPopulation - kidsCount;

  // 3. Employment Status
  // Rough heuristic: occupation is not null, not empty, not "Student", not "None", not "Unemployed"
  const unemployedKeywords = ['student', 'none', 'unemployed', 'n/a', 'nothing', 'child'];
  
  // Fetch family members with occupations to filter in JS (since ILIKE/Regex varies by SQL dialect)
  const familyOccs = await FamilyMembers.findAll({ 
    where: { ...baseWhere, status: 'Alive' },
    attributes: ['occupation']
  });

  let employedFamily = 0;
  let unemployedFamily = 0;

  familyOccs.forEach(member => {
    const occ = (member.occupation || "").trim().toLowerCase();
    if (!occ || unemployedKeywords.includes(occ)) {
      unemployedFamily++;
    } else {
      employedFamily++;
    }
  });

  // Assume Citizens are employed unless tracked otherwise (simplified for now)
  const employed = employedFamily + citizens;
  const unemployed = unemployedFamily + kidsCount; // Count kids as generally unemployed/students
  
  return {
    population: totalPopulation,
    citizens,
    localLeaders,
    households,
    familyMembersTotal: totalFamily,
    deceasedRecorded: familyMembersDeceased,
    
    // Demographics
    males: totalMale,
    females: totalFemale,
    adults: adultsCount < 0 ? 0 : adultsCount, // Sanity check
    kids: kidsCount,
    employed,
    unemployed,
    
    timestamp: new Date()
  };
};

import db from "../database/models/index.js";

const { FamilyMembers, Users, Counties, Districts, Clans, Towns, Villages } = db;

export const createFamilyMember = async (data) => {
  return await FamilyMembers.create(data);
};

export const getFamilyMembersByHead = async (headId) => {
  return await FamilyMembers.findAll({
    where: { household_head_id: headId },
    include: [
      { model: Counties, as: "county", attributes: ["name"] },
      { model: Districts, as: "district", attributes: ["name"] },
      { model: Clans, as: "clan", attributes: ["name"] },
      { model: Towns, as: "town", attributes: ["name"] },
      { model: Villages, as: "village", attributes: ["name"] },
    ],
  });
};

export const updateFamilyMember = async (id, data) => {
  const member = await FamilyMembers.findByPk(id);
  if (!member) return null;
  return await member.update(data);
};

export const getFamilyMemberById = async (id) => {
  return await FamilyMembers.findByPk(id, {
    include: [
      { model: Users, as: "head", attributes: ["firstname", "lastname", "phone"] },
    ],
  });
};

export const deleteFamilyMember = async (id) => {
  const member = await FamilyMembers.findByPk(id);
  if (!member) return null;
  await member.destroy();
  return true;
};

export const getScopedFamilyMembers = async (whereClause) => {
  return await FamilyMembers.findAll({
    where: whereClause,
    include: [
      { model: Users, as: "head", attributes: ["firstname", "lastname"] },
      { model: Counties, as: "county", attributes: ["name"] },
      { model: Districts, as: "district", attributes: ["name"] },
      { model: Clans, as: "clan", attributes: ["name"] },
      { model: Towns, as: "town", attributes: ["name"] },
      { model: Villages, as: "village", attributes: ["name"] },
    ],
  });
};

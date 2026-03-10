import * as familyService from "../services/familyMemberService.js";
import { getLocationScope } from "../middlewares/roleConfig.js";

export const addFamilyMember = async (req, res) => {
  try {
    const { id: headId, county_id, district_id, clan_id, town_id, village_id } = req.user;
    
    // Auto-inherit location from household head
    const memberData = {
      ...req.body,
      household_head_id: headId,
      county_id: county_id || null,
      district_id: district_id || null,
      clan_id: clan_id || null,
      town_id: town_id || null,
      village_id: village_id || null
    };

    const member = await familyService.createFamilyMember(memberData);
    return res.status(201).json({
      success: true,
      message: "Family member added successfully",
      data: member
    });
  } catch (error) {
    console.error("Error adding family member:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMyFamilyMembers = async (req, res) => {
  try {
    const members = await familyService.getFamilyMembersByHead(req.user.id);
    return res.status(200).json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error("Error fetching family members:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await familyService.getFamilyMemberById(id);
    
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    // Security: Only head of household or village leader can edit (for now simplify to ownership)
    if (member.household_head_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'village_leader') {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updated = await familyService.updateFamilyMember(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Error updating family member:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await familyService.getFamilyMemberById(id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    if (member.household_head_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await familyService.deleteFamilyMember(id);
    return res.status(200).json({ success: true, message: "Member removed successfully" });
  } catch (error) {
    console.error("Error deleting family member:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getScopedFamilyMembers = async (req, res) => {
  try {
    // Uses the locationScope middleware attached scope
    // If not using middleware directly, we can generate it here
    const scope = req.locationScope || {}; 
    const members = await familyService.getScopedFamilyMembers(scope);
    
    return res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error("Error fetching scoped family members:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

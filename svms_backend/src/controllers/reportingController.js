import * as reportingService from "../services/reportingService.js";

export const generateReport = async (req, res) => {
  try {
    const { id, role, county_id, district_id, clan_id, town_id, village_id } = req.user;
    const { title, type, summary } = req.body;

    const scope = req.locationScope || {};
    
    // Gather statistics for the JSONB data field
    const stats = await reportingService.aggregateLocationStats(scope);

    const reportData = {
      title,
      type,
      summary,
      generatedBy: id,
      scope: role.replace('_leader', ''), // e.g., 'county'
      data: stats,
      county_id,
      district_id,
      clan_id,
      town_id,
      village_id
    };

    const report = await reportingService.createReport(reportData);
    
    return res.status(201).json({
      success: true,
      message: "Report generated successfully",
      data: report
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const { id } = req.user;
    const reports = await reportingService.getReportsByScope({ generatedBy: id });
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching my reports:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const scope = req.locationScope || {};
    const reports = await reportingService.getReportsByScope(scope);
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching all reports:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getReportDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportingService.getReportById(id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error("Error fetching report details:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

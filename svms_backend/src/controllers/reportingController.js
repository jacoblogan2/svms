import * as reportingService from "../services/reportingService.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import { ROLE_LEVELS } from "../middlewares/roleConfig.js";

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
    // Only fetch reports where the generator's scope falls under this user's scope
    const reports = await reportingService.getReportsByScope(scope);
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching all reports:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getReceivedReports = async (req, res) => {
  try {
    const { role } = req.user;
    const scope = req.locationScope || {};
    
    // Fetch reports that were explicitly sent to this role level within this user's jurisdiction
    const reports = await reportingService.getReportsByScope({ 
      ...scope, 
      sentTo: role,
      status: 'submitted' 
    });
    
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching received reports:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const defaultScope = req.locationScope || {};
    const { startDate, endDate, county_id, district_id, clan_id, town_id, village_id } = req.query;
    
    // Admins can override scope dynamically.
    // Explicit UI filters take precedence if they are set.
    const explicitScope = {};
    if (county_id) explicitScope.county_id = county_id;
    if (district_id) explicitScope.district_id = district_id;
    if (clan_id) explicitScope.clan_id = clan_id;
    if (town_id) explicitScope.town_id = town_id;
    if (village_id) explicitScope.village_id = village_id;

    // Merge scopes, explicit overrides default scope (applicable mostly for admins filtering down)
    const scope = { ...defaultScope, ...explicitScope };
    
    let timeFilter = null;
    if (startDate && endDate) {
      timeFilter = {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      };
    }
    
    const stats = await reportingService.aggregateLocationStats(scope, timeFilter);
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
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

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await reportingService.deleteReport(id, req.user.id);
    return res.status(200).json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    
    // Determine next superior role
    const rolesArray = ["admin", "county_leader", "district_leader", "clan_leader", "town_leader", "village_leader"];
    const currentIndex = rolesArray.indexOf(role);
    
    if (currentIndex <= 0) {
      return res.status(400).json({ success: false, message: "Cannot submit higher than Admin" });
    }
    
    const nextLevelRole = rolesArray[currentIndex - 1];
    
    const report = await reportingService.submitReport(id, req.user.id, nextLevelRole);
    return res.status(200).json({ success: true, message: `Report submitted to ${nextLevelRole.replace('_', ' ')}`, data: report });
  } catch (error) {
    console.error("Error submitting report:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadReportPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportingService.getReportById(id);
    
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Report_${report.id}.pdf`);
    
    doc.pipe(res);

    // Document Header
    doc.fontSize(20).font('Helvetica-Bold').text('REPUBLIC OF LIBERIA', { align: 'center' });
    doc.fontSize(14).text('Smart Village Management System', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(18).text("Official Administrative Report", { align: 'center', underline: true });
    doc.moveDown(2);

    // Report Metadata
    doc.fontSize(12).font('Helvetica-Bold').text(`Title: `, { continued: true }).font('Helvetica').text(report.title);
    doc.font('Helvetica-Bold').text(`Type: `, { continued: true }).font('Helvetica').text(report.type);
    doc.font('Helvetica-Bold').text(`Date: `, { continued: true }).font('Helvetica').text(new Date(report.createdAt).toLocaleDateString());
    doc.font('Helvetica-Bold').text(`Status: `, { continued: true }).font('Helvetica').text(report.status.toUpperCase());
    
    const generatorName = report.generator ? `${report.generator.firstname} ${report.generator.lastname}` : 'Unknown';
    const generatorRole = report.generator ? report.generator.role.replace('_', ' ').toUpperCase() : 'N/A';
    doc.font('Helvetica-Bold').text(`Prepared By: `, { continued: true }).font('Helvetica').text(`${generatorName} (${generatorRole})`);
    
    doc.moveDown();
    
    // Summary Section
    doc.font('Helvetica-Bold').fontSize(14).text('Executive Summary');
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(12).text(report.summary || "No summary provided.", { align: 'justify' });
    
    doc.moveDown(2);

    // Data/Statistics Section
    doc.font('Helvetica-Bold').fontSize(14).text('Gathered Statistics');
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    const data = report.data || {};
    
    const statItem = (label, val) => {
      doc.font('Helvetica-Bold').text(`${label}: `, { continued: true }).font('Helvetica').text(val !== undefined ? val : 'N/A');
    };

    statItem('Total System Population', data.population);
    statItem('Registered Citizens', data.citizens);
    statItem('Registered Local Leaders', data.localLeaders);
    statItem('Total Households', data.households);
    statItem('Deceased Records', data.deceasedRecorded);
    
    doc.moveDown(1.5);
    
    // Demographics Breakdown Section
    doc.font('Helvetica-Bold').fontSize(14).text('Demographics Breakdown');
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').fontSize(12).text('Gender Split:');
    doc.font('Helvetica').text(`Male: ${data.males || 0} | Female: ${data.females || 0}`);
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Age Groups:');
    doc.font('Helvetica').text(`Adults (18+): ${data.adults || 0} | Kids (<18): ${data.kids || 0}`);
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Employment Status:');
    doc.font('Helvetica').text(`Employed: ${data.employed || 0} | Unemployed/Student: ${data.unemployed || 0}`);

    // Add location context if available
    let locationString = [];
    if (report.county) locationString.push(`${report.county.name} County`);
    if (report.district) locationString.push(`${report.district.name} District`);
    if (locationString.length > 0) {
      doc.moveDown();
      doc.font('Helvetica-Bold').text(`Jurisdiction: `, { continued: true }).font('Helvetica').text(locationString.join(', '));
    }

    // Footer
    doc.moveDown(5);
    doc.font('Helvetica-Oblique').fontSize(10).text('This is an automatically generated system report and is official for SVMS internal use only.', { align: 'center' });
    const signatureLineY = doc.y + 40;
    doc.moveTo(200, signatureLineY).lineTo(400, signatureLineY).stroke();
    doc.text('Authorized Signature', 200, signatureLineY + 5, { width: 200, align: 'center' });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Error generating PDF document" });
    }
  }
};

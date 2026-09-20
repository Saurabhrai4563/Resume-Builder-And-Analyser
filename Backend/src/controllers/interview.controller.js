//const pdfParse = require('pdf-parse');
const generateInterviewReport = require('../services/ai.service');
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @name getInterviewQuestions
 * @description Upload resume PDF, parse text, and call AI to generate interview report
 */
async function getInterviewQuestions(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                message: "Job description is required to generate an interview report."
            });
        }

        let resumeText = "";
        if (req.file && req.file.buffer) {
            try {
                const pdfParse = require("pdf-parse");
                // Handle both pdf-parse v2 class structure and legacy function calls safely
                if (typeof pdfParse.PDFParse === "function") {
                    const parser = new pdfParse.PDFParse(Uint8Array.from(req.file.buffer));
                    const result = await parser.getText();
                    resumeText = typeof result === "string" ? result : (result.text || "");
                } else if (typeof pdfParse === "function") {
                    const result = await pdfParse(req.file.buffer);
                    resumeText = result.text || "";
                }
            } catch (pdfErr) {
                console.error("PDF Parsing Warning:", pdfErr.message);
                resumeText = "";
            }
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({
            message: error.message || "Failed to generate interview report"
        });
    }
}

/**
 * @name getAllInterviewReports
 * @description Fetch all interview reports for the authenticated user
 */
async function getAllInterviewReports(req, res) {
    try {
        const reports = await interviewReportModel
            .find({ user: req.user.id })
            .select("-resume -technicalQuestions -behavioralQuestions -preparationPlan")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Interview reports fetched successfully",
            reports
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Failed to fetch interview reports" });
    }
}

/**
 * @name getInterviewReportById
 * @description Fetch a specific interview report by ID
 */
async function getInterviewReportById(req, res) {
    try {
        const { interviewId } = req.params;
        const report = await interviewReportModel.findById(interviewId);

        if (!report) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        if (report.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access to this report" });
        }

        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport: report
        });
    } catch (error) {
        console.error("Error fetching report details:", error);
        res.status(500).json({ message: "Failed to fetch interview report details" });
    }
}

/**
 * @name deleteInterviewReport
 * @description Delete an interview report by ID
 */
async function deleteInterviewReport(req, res) {
    try {
        const { interviewId } = req.params;
        const report = await interviewReportModel.findById(interviewId);

        if (!report) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        if (report.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized deletion of this report" });
        }

        await interviewReportModel.findByIdAndDelete(interviewId);

        res.status(200).json({ message: "Interview report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ message: "Failed to delete interview report" });
    }
}

module.exports = {
    getInterviewQuestions,
    getAllInterviewReports,
    getInterviewReportById,
    deleteInterviewReport
};
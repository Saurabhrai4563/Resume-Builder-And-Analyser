import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import Navbar from "../../../components/Navbar";
import { generateReport, getReports, deleteReport } from "../services/interview.api";
import "../style/home.scss";

const Home = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [history, setHistory] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setFetchingHistory(true);
      const data = await getReports();
      if (data?.reports) {
        setHistory(data.reports);
      }
    } catch (err) {
      console.error("Failed to load report history:", err);
    } finally {
      setFetchingHistory(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setError("Please select a valid PDF file.");
        return;
      }
      setError(null);
      setResumeFile(file);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      if (response?.interviewReport?._id) {
        navigate(`/interview/${response.interviewReport._id}`);
      } else {
        setError("Failed to obtain interview report. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Error generating report.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (e, reportId) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await deleteReport(reportId);
      setHistory((prev) => prev.filter((item) => item._id !== reportId));
    } catch (err) {
      alert("Failed to delete report.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="home">
        <section className="interview-card">
          <div className="card-header">
            <p className="eyebrow">AI Interview Assistant</p>
            <h1>Generate Your Interview Report</h1>
            <p className="subtext">
              Upload your resume and paste the target job description. Our AI will analyze skill gaps, predict tailored interview questions, and build a 7-day preparation plan.
            </p>
          </div>

          {error && (
            <div className="error-alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="interview-input-group">
            <div className="left">
              <div className="field-group">
                <label htmlFor="jobDescription">
                  Job Description <span className="required-star">*</span>
                </label>
                <textarea
                  name="jobDescription"
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description or key responsibilities here..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="right">
              <div className="field-group">
                <div className="resume-card">
                  <p className="resume-title">Resume (PDF)</p>
                  <small className="highlight">
                    Upload your latest resume PDF for accurate skill match scoring.
                  </small>
                  
                  {resumeFile ? (
                    <div className="selected-file">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{resumeFile.name}</span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="remove-file-btn"
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="file-label" htmlFor="resume">
                        📁 Upload PDF Resume
                      </label>
                      <input
                        hidden
                        type="file"
                        name="resume"
                        id="resume"
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="selfDescription">Self Description (Optional)</label>
                <textarea
                  name="selfDescription"
                  id="selfDescription"
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Mention additional experience, key achievements, or specific technical strengths..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`button primary-button ${loading ? "loading-state" : ""}`}
              >
                {loading ? (
                  <span className="loading-spinner-wrap">
                    <span className="spinner"></span> Generating Report...
                  </span>
                ) : (
                  "✨ Generate Interview Report"
                )}
              </button>
            </div>
          </form>

          {/* Past Reports History */}
          <div className="history-section">
            <h2>Your Recent Interview Reports</h2>
            {fetchingHistory ? (
              <p className="loading-history">Loading report history...</p>
            ) : history.length === 0 ? (
              <p className="empty-history">No reports generated yet. Create your first report above!</p>
            ) : (
              <div className="history-grid">
                {history.map((report) => (
                  <div
                    key={report._id}
                    className="history-card"
                    onClick={() => navigate(`/interview/${report._id}`)}
                  >
                    <div className="history-header">
                      <span className="report-date">
                        {new Date(report.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={(e) => handleDeleteReport(e, report._id)}
                        className="delete-history-btn"
                        title="Delete report"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="history-jd">
                      {report.jobDescription.substring(0, 90)}...
                    </p>
                    <div className="history-footer">
                      <span className="score-badge">Match: {report.matchScore ?? "N/A"}%</span>
                      <span className="view-link">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;

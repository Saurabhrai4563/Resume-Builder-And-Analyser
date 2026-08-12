import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import Navbar from "../../../components/Navbar";
import { getReportById, deleteReport } from "../services/interview.api";
import "../style/interview.scss";

const Interview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [section, setSection] = useState("technical");
  const [expanded, setExpanded] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [interviewId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getReportById(interviewId);
      if (data?.interviewReport) {
        setReport(data.interviewReport);
      } else {
        setError("Interview report not found.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load report details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await deleteReport(interviewId);
      navigate("/");
    } catch (err) {
      alert("Failed to delete report.");
    }
  };

  const handleCopyQuestion = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="interview-page">
          <div className="loading-container">
            <div className="spinner"></div>
            <h2>Fetching Your AI Interview Report...</h2>
          </div>
        </main>
      </>
    );
  }

  if (error || !report) {
    return (
      <>
        <Navbar />
        <main className="interview-page">
          <div className="error-container">
            <h2>⚠️ {error || "Report unavailable"}</h2>
            <Link to="/" className="back-btn">← Back to Dashboard</Link>
          </div>
        </main>
      </>
    );
  }

  const technicalQuestions = report.technicalQuestions || [];
  const behavioralQuestions = report.behavioralQuestions || [];
  const preparationPlan = report.preparationPlan || [];
  const skillGaps = report.skillGaps || [];
  const matchScore = report.matchScore ?? 0;

  const currentQuestions =
    section === "technical"
      ? technicalQuestions
      : section === "behavioral"
      ? behavioralQuestions
      : [];

  return (
    <>
      <Navbar />
      <main className="interview-page">
        <div className="page-header-actions">
          <Link to="/" className="back-link">← Back to Dashboard</Link>
          <button onClick={handleDelete} className="delete-report-btn">
            🗑️ Delete Report
          </button>
        </div>

        <div className="interview-card">
          {/* Vertical Navigation Panel */}
          <aside className="panel left">
            <nav className="nav-vertical">
              <ul>
                <li
                  className={section === "technical" ? "active" : ""}
                  onClick={() => {
                    setSection("technical");
                    setExpanded(0);
                  }}
                >
                  🎯 Technical ({technicalQuestions.length})
                </li>
                <li
                  className={section === "behavioral" ? "active" : ""}
                  onClick={() => {
                    setSection("behavioral");
                    setExpanded(0);
                  }}
                >
                  💬 Behavioral ({behavioralQuestions.length})
                </li>
                <li
                  className={section === "roadmap" ? "active" : ""}
                  onClick={() => {
                    setSection("roadmap");
                    setExpanded(null);
                  }}
                >
                  🗺️ Road Map ({preparationPlan.length} Days)
                </li>
              </ul>

              {section !== "roadmap" && (
                <div className="question-list">
                  {currentQuestions.map((_, i) => (
                    <button
                      key={i}
                      className={`q-item ${expanded === i ? "selected" : ""}`}
                      onClick={() => setExpanded(i)}
                    >
                      Q{i + 1}
                    </button>
                  ))}
                </div>
              )}
            </nav>
          </aside>

          {/* Central Question & Roadmap Content */}
          <section className="panel center">
            <div className="center-inner">
              <div className="center-header">
                <h3 className="section-title">
                  {section === "technical"
                    ? "Technical Questions"
                    : section === "behavioral"
                    ? "Behavioral Questions"
                    : "7-Day Preparation Plan"}
                </h3>
                <span className="count">
                  {section === "roadmap"
                    ? `${preparationPlan.length} Days Plan`
                    : `${currentQuestions.length} questions`}
                </span>
              </div>

              {section === "roadmap" ? (
                <div className="roadmap-container">
                  {preparationPlan.map((planItem, idx) => (
                    <div className="day-card" key={idx}>
                      <div className="day-badge">Day {planItem.day || idx + 1}</div>
                      <div className="day-content">
                        <h4 className="focus-title">Focus: {planItem.focus}</h4>
                        <ul className="task-list">
                          {planItem.tasks?.map((task, tIdx) => (
                            <li key={tIdx}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="accordion">
                  {currentQuestions.map((q, i) => {
                    const open = expanded === i;
                    return (
                      <div className={`card ${open ? "open" : ""}`} key={i}>
                        <button
                          className="card-header"
                          onClick={() => setExpanded(open ? null : i)}
                        >
                          <div className="q-label">Q{i + 1}</div>
                          <div className="q-title">{q.question}</div>
                          <div className={`chev ${open ? "rot" : ""}`}>▾</div>
                        </button>

                        {open && (
                          <div className="card-body">
                            {q.intention && (
                              <div className="intention-box">
                                <strong>💡 Interviewer Intention:</strong>
                                <p>{q.intention}</p>
                              </div>
                            )}

                            {q.answer && (
                              <div className="answer">
                                <div className="answer-header">
                                  <h4>Recommended Answer Strategy</h4>
                                  <button
                                    onClick={() => handleCopyQuestion(q.question + "\n\nAnswer: " + q.answer, i)}
                                    className="copy-btn"
                                  >
                                    {copiedIndex === i ? "✓ Copied" : "📋 Copy"}
                                  </button>
                                </div>
                                <p>{q.answer}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Right Meta Panel (Match Score & Skill Gaps) */}
          <aside className="panel right">
            <div className="meta">
              <div className="match">
                <div className="match-left">
                  <span className="label">Match Score</span>
                </div>
                <div className="match-right">
                  <svg className="match-ring" viewBox="0 0 80 80">
                    <circle
                      className="ring-bg"
                      cx="40"
                      cy="40"
                      r="36"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      className="ring-fg"
                      cx="40"
                      cy="40"
                      r="36"
                      strokeWidth="6"
                      fill="none"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 36}`,
                        strokeDashoffset: `${2 * Math.PI * 36 * (1 - matchScore / 100)}`,
                      }}
                    />
                  </svg>
                  <div className="score-bubble">{matchScore}%</div>
                </div>
              </div>

              <div className="skill-gaps">
                <h4>Skill Gaps Identified</h4>
                {skillGaps.length === 0 ? (
                  <p className="no-gaps">No significant skill gaps found!</p>
                ) : (
                  <div className="skills">
                    {skillGaps.map((s, i) => (
                      <span
                        key={i}
                        className={`skill-pill severity-${s.severity || "low"}`}
                      >
                        <span className="dot">•</span> {s.skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Interview;

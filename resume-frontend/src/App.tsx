import { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const uploadResume = async () => {

    if (!file) {
      alert("Please upload resume");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/upload/",
        formData
      );

      setScore(res.data.score);
      setSkills(res.data.skills_found);
      setSuggestions(res.data.suggestions);

      setLoading(false);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
      setLoading(false);
    }

  };

  return (

    <div className="container mt-5">

      <div className="main-card text-center">

        <h1 className="mb-4">🚀 AI Resume Analyzer</h1>
        <div className="upload-box mb-3">

          <input
            type="file"
            id="fileUpload"
            hidden
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
          />

          <label htmlFor="fileUpload" className="upload-label">
            📄 {file ? file.name : "Drag & Drop Resume or Click to Upload"}
          </label>

        </div>

        <button
          className="analyze-btn"
          onClick={uploadResume}
        >
          {loading ? "⏳ Analyzing..." : "🚀 Analyze Resume"}
        </button>

        {score !== null && (

          <>

            {/* SCORE METER */}

            <div className="score-section">

              <div
                className="score-circle mb-3"
                style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}
              >
                {score}%
              </div>

              <h3>ATS Resume Score</h3>

              <h5 className="analysis-done">
                ✅ Resume Analysis Complete
              </h5>

            </div>

            {/* SKILLS */}
            <div className="mt-4">
              <h4>Skills Found ({skills.length})</h4>

              {skills.length === 0 && <p>No skills detected</p>}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                {(showAllSkills ? skills : skills.slice(0, 15)).map((skill: string, i: number) => (
                  <span key={i} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Acceptance Criteria: Show toggle button only if list exceeds 15 */}
              {skills.length > 15 && (
                <button
                  onClick={() => setShowAllSkills(!showAllSkills)}
                  style={{
                    marginTop: "16px",
                    background: "rgba(255, 255, 255, 0.15)",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                    transition: "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                  }}
                >
                  {showAllSkills ? "Show Less ▲" : `Show More (${skills.length - 15} more) ▼`}
                </button>
              )}

            </div>
            {/* SUGGESTIONS */}

            <div className="suggestion-box">

              <h4>💡 Suggestions</h4>

              {suggestions.map((s, i) => (
                <div key={i} className="suggestion-item">
                  📌 {s}
                </div>
              ))}

            </div>

          </>

        )}

      </div>

    </div>
  );
}

export default App;
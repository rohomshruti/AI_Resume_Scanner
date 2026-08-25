import { useState } from "react";
import { ScanLine, ShieldCheck } from "lucide-react";
import "./scanner.css";
import GlassCard from "./components/GlassCard.jsx";
import UploadZone from "./components/UploadZone.jsx";
import LoadingState from "./components/LoadingState.jsx";
import ErrorState from "./components/ErrorState.jsx";
import AnalysisDashboard from "./components/AnalysisDashboard.jsx";
import { analyzeResume } from "./analyzeResume.js";

export default function ResumeScannerApp() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const runAnalysis = async (target) => {
    const source = target || file;
    if (!source) return;
    setStatus("loading");
    setError("");
    try {
      const data = await analyzeResume(source);
      setResult(data);
      setStatus("done");
    } catch {
      setError("The scan failed while reading your document. Please try again.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");
    setStatus("idle");
  };

  return (
    <div className="rs-root">
      <div className="rs-shell">
        <nav className="rs-nav">
          <div className="rs-brand">
            <span className="rs-brand-mark">
              <ScanLine size={20} />
            </span>
            ResumeIQ
          </div>
          <span className="rs-pill">
            <span className="rs-dot" />
            AI engine online
          </span>
        </nav>

        {status !== "done" ? (
          <header className="rs-hero">
            <span className="rs-pill">
              <ShieldCheck size={14} /> Private, in-browser resume analysis
            </span>
            <h1>
              AI <span className="rs-grad">Resume Scanner</span>
            </h1>
            <p>
              Upload your resume and get an instant, recruiter-grade breakdown — overall score,
              extracted skills, ATS readiness and matched job opportunities in seconds.
            </p>
          </header>
        ) : null}

        {status === "idle" ? (
          <GlassCard
            title="Upload your resume"
            subtitle="We support PDF and DOCX files"
            icon={<ScanLine size={17} />}
            style={{ maxWidth: 720, margin: "0 auto" }}
          >
            <UploadZone
              file={file}
              onSelect={(f) => {
                setError("");
                setFile(f);
              }}
              onClear={() => setFile(null)}
              onAnalyze={() => runAnalysis()}
              onError={(msg) => {
                setError(msg);
                setStatus("error");
              }}
            />
          </GlassCard>
        ) : null}

        {status === "loading" ? (
          <GlassCard style={{ maxWidth: 720, margin: "0 auto" }}>
            <LoadingState />
          </GlassCard>
        ) : null}

        {status === "error" ? (
          <GlassCard style={{ maxWidth: 720, margin: "0 auto" }}>
            <ErrorState message={error} onRetry={reset} />
          </GlassCard>
        ) : null}

        {status === "done" && result ? (
          <AnalysisDashboard result={result} onReset={reset} />
        ) : null}

        <footer className="rs-footer">
          ResumeIQ · AI-assisted resume intelligence. Files never leave your browser.
        </footer>
      </div>
    </div>
  );
}

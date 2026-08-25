import { Award, Braces, FileSearch, ScrollText, Target, RotateCcw } from "lucide-react";
import GlassCard from "./GlassCard.jsx";
import ScoreRing from "./ScoreRing.jsx";
import MetricBar from "./MetricBar.jsx";
import SkillBadges from "./SkillBadges.jsx";
import JobMatchList from "./JobMatchList.jsx";

export default function AnalysisDashboard({ result, onReset }) {
  return (
    <div>
      <div className="rs-results-head">
        <div>
          <h2>Analysis Report</h2>
          <div className="rs-file-name">
            {result.fileName} · scanned just now
          </div>
        </div>
        <button type="button" className="rs-btn rs-btn--ghost" onClick={onReset}>
          <RotateCcw size={16} />
          Scan another resume
        </button>
      </div>

      <div className="rs-grid">
        <GlassCard
          className="rs-col-4"
          title="Overall Resume Score"
          subtitle="Weighted across five evaluation dimensions"
          icon={<Award size={17} />}
        >
          <ScoreRing value={result.score} />
          <div className="rs-stats">
            <div className="rs-stat">
              <strong>{result.skills.length}</strong>
              <span>Skills</span>
            </div>
            <div className="rs-stat">
              <strong>{result.yearsExperience}y</strong>
              <span>Experience</span>
            </div>
            <div className="rs-stat">
              <strong>{result.atsSafe ? "Yes" : "Risk"}</strong>
              <span>ATS Safe</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard
          className="rs-col-8"
          title="Skill Match Indicators"
          subtitle="How your resume performs on each scoring dimension"
          icon={<Target size={17} />}
          style={{ animationDelay: "60ms" }}
        >
          {result.metrics.map((m) => (
            <MetricBar key={m.label} label={m.label} value={m.value} />
          ))}
          <div style={{ marginTop: 22 }}>
            <h3 className="rs-card-title">
              <Braces size={17} />
              Extracted Skills
            </h3>
            <p className="rs-card-sub">Detected competencies from your document</p>
            <SkillBadges skills={result.skills} />
          </div>
        </GlassCard>

        <GlassCard
          className="rs-col-7"
          title="Resume Summary"
          subtitle="AI-generated evaluation of your profile"
          icon={<FileSearch size={17} />}
          style={{ animationDelay: "120ms" }}
        >
          <p className="rs-summary">{result.summary}</p>
        </GlassCard>

        <GlassCard
          className="rs-col-5"
          title="Job Matching Score"
          subtitle="Average fit against current market openings"
          icon={<Target size={17} />}
          style={{ animationDelay: "160ms" }}
        >
          <ScoreRing value={result.jobMatchScore} label="Job Fit" size={148} />
        </GlassCard>

        <GlassCard
          className="rs-col-7"
          title="Recommended Jobs"
          subtitle="Roles ranked by compatibility with your profile"
          icon={<Award size={17} />}
          style={{ animationDelay: "200ms" }}
        >
          <JobMatchList jobs={result.jobs} />
        </GlassCard>

        <GlassCard
          className="rs-col-5"
          title="Extracted Resume Text"
          subtitle="Raw content parsed from your document"
          icon={<ScrollText size={17} />}
          style={{ animationDelay: "240ms" }}
        >
          <pre className="rs-text">{result.extracted}</pre>
        </GlassCard>
      </div>
    </div>
  );
}

import { Briefcase, CheckCircle, AlertCircle } from "lucide-react";

export default function JobMatchList({ jobs = [] }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="rs-empty">
        <Briefcase size={20} />
        <p>No matching jobs found.</p>
      </div>
    );
  }

  return (
    <div>
      {jobs.map((job, index) => (
        <article
          className="rs-job"
          key={`${job.title}-${job.company}-${index}`}
        >
          {/* Job Icon */}
          <span className="rs-file-badge">
            <Briefcase size={18} />
          </span>

          {/* Job Information */}
          <div className="rs-job-info">
            <div className="rs-job-title">
              {job.title}
            </div>

            <div className="rs-job-meta">
              {job.company}
            </div>

            {/* Matched Skills */}
            {job.matchedSkills && job.matchedSkills.length > 0 && (
              <div className="rs-badges" style={{ marginTop: 10 }}>
                <div
                  style={{
                    fontSize: "0.72rem",
                    marginBottom: 6,
                    opacity: 0.7,
                  }}
                >
                  Matched Skills
                </div>

                {job.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rs-badge rs-badge--green"
                    style={{ fontSize: "0.72rem" }}
                  >
                    <CheckCircle
                      size={11}
                      style={{ marginRight: 4 }}
                    />
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Missing Skills */}
            {job.missingSkills && job.missingSkills.length > 0 && (
              <div className="rs-badges" style={{ marginTop: 8 }}>
                <div
                  style={{
                    fontSize: "0.72rem",
                    marginBottom: 6,
                    opacity: 0.7,
                  }}
                >
                  Missing Skills
                </div>

                {job.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rs-badge"
                    style={{
                      fontSize: "0.72rem",
                      opacity: 0.75,
                    }}
                  >
                    <AlertCircle
                      size={11}
                      style={{ marginRight: 4 }}
                    />
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Match Score */}
          <div className="rs-job-score">
            <strong>{job.score}%</strong>
            <span>match</span>
          </div>
        </article>
      ))}
    </div>
  );
}
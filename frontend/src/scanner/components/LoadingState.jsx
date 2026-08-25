import { useEffect, useState } from "react";

const STEPS = ["Parsing document", "Extracting text", "Detecting skills", "Matching jobs"];

export default function LoadingState() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rs-loading">
      <div className="rs-scanner">
        <span style={{ top: 22, width: 60 }} />
        <span style={{ top: 42, width: 78 }} />
        <span style={{ top: 62, width: 50 }} />
        <span style={{ top: 82, width: 72 }} />
        <span style={{ top: 102, width: 40 }} />
        <div className="rs-scanner-beam" />
      </div>
      <h3>Analyzing your resume...</h3>
      <p>Our AI engine is reading your document and scoring it against live job data.</p>
      <div className="rs-steps">
        {STEPS.map((step, i) => (
          <span key={step} className={`rs-step ${i === active ? "is-active" : ""}`}>
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

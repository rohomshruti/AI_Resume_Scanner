import { useEffect, useState } from "react";

export default function ScoreRing({ value = 0, label = "Overall Score", size = 176 }) {
  const [display, setDisplay] = useState(0);
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className="rs-ring-wrap">
      <div className="rs-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <defs>
            <linearGradient id="rsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3d8bff" />
              <stop offset="100%" stopColor="#23d18b" />
            </linearGradient>
          </defs>
          <circle
            className="rs-ring-track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth="12"
          />
          <circle
            className="rs-ring-value"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * display) / 100}
          />
        </svg>
        <div className="rs-ring-center">
          <div>
            <div className="rs-ring-num">{display}</div>
            <div className="rs-ring-label">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

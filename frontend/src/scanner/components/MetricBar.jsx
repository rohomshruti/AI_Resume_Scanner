import { useEffect, useState } from "react";

export default function MetricBar({ label, value }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 120);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="rs-metric">
      <div className="rs-metric-top">
        <strong>{label}</strong>
        <span>{value}%</span>
      </div>
      <div className="rs-bar">
        <i style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

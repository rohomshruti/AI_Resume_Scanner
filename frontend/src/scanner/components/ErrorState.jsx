import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rs-error">
      <div className="rs-error-icon">
        <AlertTriangle size={26} />
      </div>
      <h3>We couldn&apos;t analyze that file</h3>
      <p>{message || "Something went wrong while scanning your resume."}</p>
      <button type="button" className="rs-btn" onClick={onRetry}>
        <RotateCcw size={17} />
        Try Again
      </button>
    </div>
  );
}

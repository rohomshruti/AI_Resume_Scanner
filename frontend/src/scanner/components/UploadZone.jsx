import { useRef, useState } from "react";
import { UploadCloud, FileText, X, Sparkles } from "lucide-react";

const ACCEPTED = [".pdf", ".docx"];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadZone({ file, onSelect, onClear, onAnalyze, onError }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  const validate = (candidate) => {
    if (!candidate) return;
    const ok = ACCEPTED.some((ext) => candidate.name.toLowerCase().endsWith(ext));
    if (!ok) {
      onError("Unsupported format. Please upload a PDF or DOCX resume.");
      return;
    }
    if (candidate.size > 10 * 1024 * 1024) {
      onError("That file is larger than 10 MB. Please upload a smaller resume.");
      return;
    }
    onSelect(candidate);
  };

  return (
    <div>
      <div
        className={`rs-drop ${over ? "is-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          validate(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <div className="rs-drop-icon">
          <UploadCloud size={32} />
        </div>
        <h3>Drop your resume here</h3>
        <p>Drag and drop your file, or browse from your device</p>
        <button
          type="button"
          className="rs-btn"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <FileText size={17} />
          Browse Files
        </button>
        <div className="rs-hint">PDF or DOCX · up to 10 MB · processed privately</div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          hidden
          onChange={(e) => {
            validate(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {file ? (
        <>
          <div className="rs-file" style={{ marginTop: 18 }}>
            <span className="rs-file-badge">
              {file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX"}
            </span>
            <div className="rs-file-meta">
              <div className="rs-file-name">{file.name}</div>
              <div className="rs-file-size">
                {formatSize(file.size)} · ready to scan
              </div>
            </div>
            <button type="button" className="rs-icon-btn" onClick={onClear} aria-label="Remove file">
              <X size={16} />
            </button>
          </div>
          <button type="button" className="rs-btn rs-btn--wide" onClick={onAnalyze}>
            <Sparkles size={18} />
            Analyze Resume
          </button>
        </>
      ) : (
        <div className="rs-file" style={{ marginTop: 18, background: "rgba(255,255,255,0.03)" }}>
          <span className="rs-file-badge" style={{ background: "rgba(255,255,255,0.08)", color: "#93a9b5" }}>
            <FileText size={18} />
          </span>
          <div className="rs-file-meta">
            <div className="rs-file-name">No resume selected yet</div>
            <div className="rs-file-size">Your analysis will appear here after upload</div>
          </div>
        </div>
      )}
    </div>
  );
}

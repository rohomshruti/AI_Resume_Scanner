import React from "react";
import { createRoot } from "react-dom/client";
import ResumeScannerApp from "./scanner/ResumeScannerApp.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ResumeScannerApp />
  </React.StrictMode>
);

import React, { useEffect, useRef } from "react";

/**
 * Reusable code editor panel with step-by-step line highlighting.
 *
 * Props:
 *   code          — array of code line strings
 *   highlightedLine — 0-based index of the line to highlight (null = none)
 *   title         — optional label shown in the header bar
 */
const CodeViewer = ({ code, highlightedLine, title = "Algorithm Code" }) => {
  const lineRefs = useRef([]);

  // Auto-scroll to keep the highlighted line visible
  useEffect(() => {
    if (highlightedLine !== null && lineRefs.current[highlightedLine]) {
      lineRefs.current[highlightedLine].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedLine]);

  return (
    <div className="code-viewer">
      {/* macOS-style header bar */}
      <div className="code-viewer-header">
        <div className="code-viewer-dots">
          <span className="dot-red"></span>
          <span className="dot-yellow"></span>
          <span className="dot-green"></span>
        </div>
        <span className="code-viewer-title">{title}</span>
        <div style={{ width: 54 }} />
      </div>

      {/* Code lines */}
      <div className="code-viewer-body">
        {code.map((line, index) => (
          <div
            key={index}
            ref={(el) => (lineRefs.current[index] = el)}
            className={`code-line${highlightedLine === index ? " code-line-active" : ""}`}
          >
            <span className="code-line-number">{index + 1}</span>
            <span className="code-line-content">{line}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="code-viewer-footer">
        <span className="code-viewer-legend-dot" />
        <span className="code-viewer-legend-text">Currently executing line</span>
      </div>
    </div>
  );
};

export default CodeViewer;

import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

// ── SVG canvas constants — fixed coordinate space, no DOM measurement ────────
const SVG_W = 520;
const SVG_H = 400;
const LEVEL_H = 90;
const NODE_R = 22;

const getSvgPosition = (index) => {
  const level = Math.floor(Math.log2(index + 1));
  const levelStart = Math.pow(2, level) - 1;
  const posInLevel = index - levelStart;
  const nodesInLevel = Math.pow(2, level);
  const gap = SVG_W / nodesInLevel;
  return {
    x: gap * posInLevel + gap / 2,
    y: level * LEVEL_H + 50,
  };
};

// ── Pseudocode ────────────────────────────────────────────────────────────────
const HEAP_SORT_CODE = [
  "function heapSort(arr) {",
  "  const n = arr.length;",
  "  // Build max heap",
  "  for (let i = floor(n/2)-1; i >= 0; i--)",
  "    heapify(arr, n, i);",
  "  // Extract elements one by one",
  "  for (let i = n-1; i > 0; i--) {",
  "    swap(arr[0], arr[i]);",
  "    heapify(arr, i, 0);",
  "  }",
  "}",
  "",
  "function heapify(arr, n, i) {",
  "  let largest = i;",
  "  let left = 2*i+1, right = 2*i+2;",
  "  if (left < n && arr[left] > arr[largest])",
  "    largest = left;",
  "  if (right < n && arr[right] > arr[largest])",
  "    largest = right;",
  "  if (largest !== i) {",
  "    swap(arr[i], arr[largest]);",
  "    heapify(arr, n, largest);",
  "  }",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  switch (step.phase) {
    case "build_heap": return 3;
    case "heapify_compare_left": return 15;
    case "heapify_compare_right": return 17;
    case "heapify_swap": return 20;
    case "extract_swap": return 7;
    case "done": return 9;
    default: return null;
  }
};

// ── Pure-JS step generator ────────────────────────────────────────────────────
const generateHeapSortSteps = (input) => {
  const steps = [];
  const a = [...input];
  const n = a.length;

  const heapify = (size, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < size) {
      steps.push({ arr: [...a], comparing: [i, left], heapRange: size, swapped: false, phase: "heapify_compare_left" });
      if (a[left] > a[largest]) largest = left;
    }
    if (right < size) {
      steps.push({ arr: [...a], comparing: [largest, right], heapRange: size, swapped: false, phase: "heapify_compare_right" });
      if (a[right] > a[largest]) largest = right;
    }
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      steps.push({ arr: [...a], comparing: [i, largest], heapRange: size, swapped: true, phase: "heapify_swap" });
      heapify(size, largest);
    }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({ arr: [...a], comparing: [], heapRange: n, swapped: false, phase: "build_heap" });
    heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    steps.push({ arr: [...a], comparing: [0, i], heapRange: i, swapped: true, phase: "extract_swap" });
    heapify(i, 0);
  }
  steps.push({ arr: [...a], comparing: [], heapRange: 0, swapped: false, phase: "done" });
  return steps;
};

const generateExplanation = (step) => {
  if (!step) return "";
  if (step.phase === "done") return "✅ Heap Sort complete!";
  if (step.phase === "build_heap") return "Building max heap — heapifying next subtree…";
  if (step.phase === "extract_swap") return `Moved max element to sorted position.`;
  const [i, j] = step.comparing;
  if (step.swapped) return `Swapped ${step.arr[j]} ↔ ${step.arr[i]} to restore heap property.`;
  return `Comparing [${i}]=${step.arr[i]} with child [${j}]=${step.arr[j]}.`;
};

// ── Component ─────────────────────────────────────────────────────────────────
const HeapSortPage = () => {
  const [input, setInput] = useState("5,3,8,4,2");
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [error, setError] = useState("");
  const timerRef = useRef(null);
  const highlightTimerRef = useRef(null);

  const handlePlay = () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const parsed = input.split(",").map(Number).filter((n) => !isNaN(n));
      if (parsed.length === 0) { setError("Invalid input!"); return; }
      if (parsed.length > 15) { setError("Max 15 elements for a clear view."); return; }
      setError("");
      setArray(parsed);
      setCurrentStepIndex(0);
      setExplanation("Building max heap…");
      setSteps(generateHeapSortSteps(parsed));
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
  };

  const handleReplay = () => {
    clearTimeout(timerRef.current);
    setIsPlaying(false);
    setSteps([]); setArray([]);
    setCurrentStepIndex(0); setExplanation("");
    setHighlightedLine(null); setError("");
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) {
      if (isPlaying && currentStepIndex >= steps.length && steps.length > 0)
        setIsPlaying(false);
      return;
    }

    // Early highlighting phase (200ms)
    highlightTimerRef.current = setTimeout(() => {
      const s = steps[currentStepIndex];
      setHighlightedLine(getHighlightedLine(s));
    }, 200);

    // Full state update phase (1800ms)
    timerRef.current = setTimeout(() => {
      const s = steps[currentStepIndex];
      setArray(s.arr);
      setExplanation(generateExplanation(s));
      setCurrentStepIndex((i) => i + 1);
    }, 1800);

    return () => {
      clearTimeout(highlightTimerRef.current);
      clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps]);

  const step = steps[currentStepIndex - 1] || {};
  const { comparing = [], heapRange = array.length, swapped = false } = step;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 px-3 sm:px-6" style={{ color: "hsl(0 0% 96%)" }}>

      <AlgoPageHeader
        icon="🌳"
        title="Heap Sort"
        description="Converts the array into a max heap, then repeatedly extracts the maximum element to build the sorted output."
        complexity={{ time: "O(n log n)", space: "O(1)", stable: "Unstable" }}
      />

      {/* Input */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="card rounded-2xl p-4 sm:p-6">
          <label className="text-xs sm:text-sm mb-2 block" style={{ color: "hsl(220 10% 50%)" }}>
            Enter array (comma-separated, max 15 elements)
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPlaying}
            placeholder="e.g. 5,3,8,4,2"
            className="w-full px-3 sm:px-4 py-2.5 rounded-xl outline-none text-sm"
            style={{ background: "hsl(220 20% 6%)", border: "1px solid hsl(220 14% 22%)", color: "hsl(0 0% 96%)" }}
          />
          {error && <p className="text-sm mt-2" style={{ color: "hsl(0 72% 58%)" }}>{error}</p>}
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-5xl mx-auto mb-6 card rounded-2xl p-4 sm:p-6 space-y-4">
        <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
        <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
      </div>

      {/* Two-column: Visualiser + Code */}
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">

        {/* Visualiser */}
        <div className="card rounded-2xl p-4 flex flex-col">
          <AlgoVisualizationContainer>
            <div className="flex flex-col items-center justify-center min-h-[380px]">
              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="w-full max-w-xl"
                style={{ overflow: "visible" }}
              >
                {/* Edges */}
                {array.map((_, i) => {
                  const left = 2 * i + 1;
                  const right = 2 * i + 2;
                  const from = getSvgPosition(i);
                  return (
                    <React.Fragment key={i}>
                      {left < array.length && (
                        <line
                          x1={from.x} y1={from.y}
                          x2={getSvgPosition(left).x} y2={getSvgPosition(left).y}
                          stroke="hsl(220 14% 28%)" strokeWidth="1.5"
                        />
                      )}
                      {right < array.length && (
                        <line
                          x1={from.x} y1={from.y}
                          x2={getSvgPosition(right).x} y2={getSvgPosition(right).y}
                          stroke="hsl(220 14% 28%)" strokeWidth="1.5"
                        />
                      )}
                    </React.Fragment>
                  );
                })}

                {/*
                  Nodes — keyed by VALUE (not index).
                  When two values swap, React moves their actual DOM <g> elements
                  to the new transform position, so the CSS transition fires and
                  you see each circle glide across the tree.
                */}
                {array.map((value, index) => {
                  const { x, y } = getSvgPosition(index);

                  let fill = "hsl(220 60% 55%)";
                  let radius = NODE_R;
                  let glow = "none";

                  if (index >= heapRange) {
                    fill = "hsl(145 60% 42%)";
                    radius = NODE_R * 0.88;
                  }
                  if (comparing.includes(index)) {
                    fill = swapped ? "hsl(0 72% 58%)" : "hsl(40 90% 55%)";
                    radius = NODE_R * 1.22;
                    glow = swapped
                      ? "drop-shadow(0 0 10px hsl(0 72% 58% / 0.9))"
                      : "drop-shadow(0 0 10px hsl(40 90% 55% / 0.9))";
                  }

                  return (
                    <g
                      key={value}
                      transform={`translate(${x}, ${y})`}
                      style={{
                        transition: "transform 550ms cubic-bezier(0.4, 0, 0.2, 1)",
                        filter: glow,
                      }}
                    >
                      <circle
                        r={radius}
                        fill={fill}
                        style={{ transition: "r 250ms ease, fill 250ms ease" }}
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={14}
                        fontWeight="700"
                        fill="hsl(220 20% 6%)"
                        style={{ userSelect: "none", pointerEvents: "none" }}
                      >
                        {value}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </AlgoVisualizationContainer>

          {/* Legend */}
          {array.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4 text-xs" style={{ color: "hsl(220 10% 60%)" }}>
              {[
                { color: "hsl(220 60% 55%)", label: "In heap" },
                { color: "hsl(40 90% 55%)", label: "Comparing" },
                { color: "hsl(0 72% 58%)", label: "Swapping" },
                { color: "hsl(145 60% 42%)", label: "Sorted" },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Code viewer */}
        <div className="card rounded-2xl p-4 flex flex-col">
          <CodeViewer code={HEAP_SORT_CODE} highlightedLine={highlightedLine} title="heapSort.js" />
        </div>

      </div>
    </div>
  );
};

export default HeapSortPage;
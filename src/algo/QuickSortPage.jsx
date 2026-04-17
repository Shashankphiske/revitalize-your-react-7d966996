import React, { useState, useEffect, useRef } from "react";
import ControlButtons from "../ControlButtons";
import CodeViewer from "../CodeViewer";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const QUICK_SORT_CODE = [
  "function quickSort(arr, lo, hi) {",
  "  if (lo < hi) {",
  "    const p = partition(arr, lo, hi);",
  "    quickSort(arr, lo, p - 1);",
  "    quickSort(arr, p + 1, hi);",
  "  }",
  "}",
  "function partition(arr, lo, hi) {",
  "  const pivot = arr[hi];",
  "  let i = lo - 1;",
  "  for (let j = lo; j < hi; j++) {",
  "    if (arr[j] < pivot) {",
  "      i++;",
  "      [arr[i], arr[j]] = [arr[j], arr[i]];",
  "    }",
  "  }",
  "  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];",
  "  return i + 1;",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (!step.comparing || step.comparing.length === 0) return 7;
  return step.swapped ? 13 : 11;
};

const QuickSortPage = () => {
  const [input, setInput] = useState("5,3,8,4,2");
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);
  const highlightTimerRef = useRef(null);

  const fetchQuickSortSteps = async (arr) => {
    const res = await fetch(
      "http://localhost:3000/sortingalgo/quicksort",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arr: JSON.stringify(arr) }),
      }
    );

    return (await res.json()).arr;
  };

  const handlePlay = async () => {
    if (isPlaying) return;

    try {
      const parsed = input
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n));

      if (parsed.length === 0) {
        setError("Invalid input!");
        return;
      }

      setError("");
      setArray(parsed);
      setCurrentStepIndex(0);
      setExplanation("Starting Quick Sort...");

      const data = await fetchQuickSortSteps(parsed);
      setSteps(data);

      setIsPlaying(true);
    } catch {
      setError("Something went wrong.");
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
  };

  const handleReplay = () => {
    clearTimeout(timerRef.current);
    setIsPlaying(false);
    setSteps([]);
    setArray([]);
    setCurrentStepIndex(0);
    setError("");
    setExplanation("");
    setHighlightedLine(null);
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;

    // Early highlighting phase (200ms)
    highlightTimerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setHighlightedLine(getHighlightedLine(step));
    }, 200);

    // Full state update phase (1800ms)
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];

      setArray(step.arr);

      setExplanation(
        step.comparing?.length
          ? step.swapped
            ? "Swapping elements..."
            : "Comparing elements..."
          : "Quick Sort completed."
      );

      setCurrentStepIndex((i) => i + 1);
    }, 1800);

    return () => {
      clearTimeout(highlightTimerRef.current);
      clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { comparing = [], pivotIndex = null, swapped = false } = currentStep;

  const inputStyle = {
    background: "hsl(220 20% 6%)",
    border: "1px solid hsl(220 14% 22%)",
    color: "hsl(0 0% 96%)",
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 px-4 sm:px-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <AlgoPageHeader
          icon="⚡"
          title="Quick Sort"
          description="Quick Sort uses a pivot to partition the array and recursively sort subarrays."
          complexity={{
            time: "O(n log n)",
            space: "O(log n)",
            stable: "Unstable",
          }}
        />

        {/* INPUT CARD */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Array Input</h3>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPlaying}
            placeholder="e.g. 5,3,8,4,2"
            className="px-3 py-2 rounded-xl w-full text-sm"
            style={inputStyle}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* CONTROLS + EXPLANATION */}
        <div className="card p-5 space-y-4">
          <ControlButtons
            onPlay={handlePlay}
            onPause={handlePause}
            onReplay={handleReplay}
            disabled={isPlaying}
          />

          <AlgoExplanation
            explanation={explanation}
            isPlaying={isPlaying}
          />
        </div>

        {/* MAIN SPLIT */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* VISUALIZATION */}
          <div className="card p-4 flex flex-col">
            <AlgoVisualizationContainer>
              <div className="flex justify-center items-end gap-2 min-h-[420px]">
                {array.map((value, index) => {
                  let bg =
                    "linear-gradient(to top, hsl(220 60% 55%), hsl(200 70% 60%))";

                  let scale = "scale(1)";
                  let shadow = "none";

                  if (index === pivotIndex) {
                    bg =
                      "linear-gradient(to top, hsl(262 80% 55%), hsl(262 80% 70%))";
                    scale = "scale(1.1)";
                    shadow =
                      "0 0 20px hsl(262 80% 55% / 0.5)";
                  }

                  if (comparing.includes(index)) {
                    bg = swapped
                      ? "linear-gradient(to top, hsl(0 72% 55%), hsl(0 72% 70%))"
                      : "linear-gradient(to top, hsl(40 90% 50%), hsl(40 90% 65%))";

                    scale = "scale(1.1)";
                    shadow =
                      "0 0 20px hsl(40 90% 55% / 0.5)";
                  }

                  const h =
                    (value / Math.max(...array)) * 100;

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-end transition-all duration-500"
                      style={{
                        height: "280px",
                        width: "3.5rem",
                        transform: scale,
                      }}
                    >
                      <div className="text-xs font-bold mb-2 px-2 py-1 rounded-lg bg-black/30">
                        {value}
                      </div>

                      <div
                        className="w-full rounded-t-xl transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          background: bg,
                          boxShadow: shadow,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* LEGEND */}
              <div className="flex justify-center gap-6 mt-6 text-sm text-gray-400 flex-wrap">
                <span>🔵 Unsorted</span>
                <span>🟣 Pivot</span>
                <span>🟠 Comparing</span>
                <span>🔴 Swapping</span>
              </div>
            </AlgoVisualizationContainer>
          </div>

          {/* CODE */}
          <div className="card p-4 flex flex-col">
            <CodeViewer
              code={QUICK_SORT_CODE}
              highlightedLine={highlightedLine}
              title="quick-sort.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickSortPage;
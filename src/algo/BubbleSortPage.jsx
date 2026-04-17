import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const BUBBLE_SORT_CODE = [
  "function bubbleSort(arr) {",
  "  for (let i = 0; i < arr.length - 1; i++) {",
  "    for (let j = 0; j < arr.length - i - 1; j++) {",
  "      if (arr[j] > arr[j + 1]) {",
  "        let temp = arr[j];",
  "        arr[j] = arr[j + 1];",
  "        arr[j + 1] = temp;",
  "      }",
  "    }",
  "  }",
  "  return arr;",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (!step.comparing || step.comparing.length === 0) return 10;
  return step.swapped ? 4 : 3;
};

const BubbleSortPage = () => {
  const [input, setInput] = useState("5,3,8,4,2");
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);
  const highlightTimerRef = useRef(null);

  const fetchSteps = async (arr) => {
    const res = await fetch(
      "http://localhost:3000/sortingalgo/bubblesort",
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

    if (steps.length === 0) {
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
      setExplanation("Starting Bubble Sort...");

      const resSteps = await fetchSteps(parsed);
      setSteps(resSteps);
    }

    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
  };

  const handleReplay = () => {
    clearTimeout(timerRef.current);
    clearTimeout(highlightTimerRef.current);
    setIsPlaying(false);
    setSteps([]);
    setArray([]);
    setCurrentStepIndex(0);
    setExplanation("");
    setError("");
    setHighlightedLine(null);
  };

  const generateExplanation = (step) => {
    if (!step.comparing || step.comparing.length === 0)
      return "Bubble Sort completed.";

    const [i, j] = step.comparing;
    const a = step.arr;

    return step.swapped
      ? `Swapped ${a[j]} and ${a[i]}`
      : `Comparing ${a[i]} and ${a[j]} — no swap`;
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) {
      if (isPlaying && currentStepIndex >= steps.length && steps.length > 0) {
        setExplanation("Bubble Sort completed.");
        setIsPlaying(false);
      }
      return;
    }

    // Early highlighting phase (200ms)
    highlightTimerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setHighlightedLine(getHighlightedLine(step));
    }, 200);

    // Full state update phase (1800ms)
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];

      setArray(step.arr);
      setExplanation(generateExplanation(step));

      setCurrentStepIndex((prev) => prev + 1);
    }, 1800);

    return () => {
      clearTimeout(highlightTimerRef.current);
      clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { comparing = [], swapped = false } = currentStep;

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
          icon="🫧"
          title="Bubble Sort"
          description="Bubble Sort repeatedly swaps adjacent elements to sort the array."
          complexity={{ time: "O(n²)", space: "O(1)", stable: "Stable" }}
        />

        {/* INPUT */}
        <div className="card p-5 sm:p-6 space-y-3">
          <h3 className="text-lg font-semibold">Input</h3>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPlaying}
            placeholder="e.g. 5,3,8,4,2"
            className="w-full px-4 py-3 rounded-xl"
            style={inputStyle}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <p className="text-xs text-gray-400">
            Try: 5,3,8,4,2 or 64,34,25,12,22,11,90
          </p>
        </div>

        {/* CONTROLS + EXPLANATION */}
        <div className="card p-5 space-y-4">
          <ControlButtons
            onPlay={handlePlay}
            onPause={handlePause}
            onReplay={handleReplay}
            disabled={isPlaying}
          />
          <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
        </div>

        {/* MAIN SPLIT */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* VISUALIZER */}
          <div className="card p-4 flex flex-col">
            <AlgoVisualizationContainer>
              <div className="flex justify-center items-end gap-2 min-h-[320px]">

                {array.map((value, index) => {
                  let bg = "linear-gradient(to top, #3b82f6, #38bdf8)";
                  let scale = "scale(1)";
                  let shadow = "none";

                  if (comparing.includes(index)) {
                    if (swapped) {
                      bg = "linear-gradient(to top, #ef4444, #f87171)";
                      shadow = "0 0 20px rgba(239,68,68,0.5)";
                    } else {
                      bg = "linear-gradient(to top, #f59e0b, #fbbf24)";
                      shadow = "0 0 20px rgba(245,158,11,0.5)";
                    }
                    scale = "scale(1.1)";
                  }

                  const h = (value / Math.max(...array)) * 100;

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-end transition-all duration-500"
                      style={{ height: "280px", width: "3rem", transform: scale }}
                    >
                      <div className="text-xs font-bold mb-1 px-2 py-1 rounded-lg bg-gray-800">
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
            </AlgoVisualizationContainer>
          </div>

          {/* CODE */}
          <div className="card p-4 flex flex-col">
            <CodeViewer
              code={BUBBLE_SORT_CODE}
              highlightedLine={highlightedLine}
              title="bubble-sort.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default BubbleSortPage;
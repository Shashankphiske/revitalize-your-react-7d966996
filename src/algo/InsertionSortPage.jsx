import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const CODE = [
  "function insertionSort(arr) {",
  "  for (let i = 1; i < arr.length; i++) {",
  "    let key = arr[i];",
  "    let j = i - 1;",
  "    while (j >= 0 && arr[j] > key) {",
  "      arr[j + 1] = arr[j];",
  "      j--;",
  "    }",
  "    arr[j + 1] = key;",
  "  }",
  "  return arr;",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (!step.comparing || step.comparing.length === 0) return 10;
  return step.swapped ? 5 : 4;
};

const InsertionSortPage = () => {
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
      "http://localhost:3000/sortingalgo/insertionsort",
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
        .map(Number)
        .filter((n) => !isNaN(n));

      if (parsed.length === 0) {
        setError("Invalid input!");
        return;
      }

      setError("");
      setArray(parsed);
      setCurrentStepIndex(0);
      setExplanation("Starting Insertion Sort...");
      setSteps(await fetchSteps(parsed));
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

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) {
      if (isPlaying && currentStepIndex >= steps.length && steps.length > 0) {
        setExplanation("Insertion Sort completed.");
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

      setExplanation(
        !step.comparing?.length
          ? "Completed."
          : step.swapped
            ? "Shifting element..."
            : `Comparing key ${step.arr[step.keyindex]}`
      );

      setCurrentStepIndex((i) => i + 1);
    }, 1800);

    return () => {
      clearTimeout(highlightTimerRef.current);
      clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { comparing = [], keyindex = null, swapped = false } = currentStep;

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
          icon="📥"
          title="Insertion Sort"
          description="Insertion Sort builds the sorted array one element at a time by inserting each new element into its correct position."
          complexity={{ time: "O(n²)", space: "O(1)", stable: "Stable" }}
        />

        {/* INPUT */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Input</h3>

          <div>
            <label className="text-sm mb-2 block">Enter array</label>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPlaying}
              placeholder="e.g., 5,3,8,4,2"
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={inputStyle}
            />
          </div>

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

          <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
        </div>

        {/* SPLIT LAYOUT */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* VISUALIZATION */}
          <div className="card p-4">
            <AlgoVisualizationContainer>
              <div
                className="flex justify-center items-end gap-2"
                style={{ minHeight: "300px" }}
              >
                {array.map((value, index) => {
                  let bg =
                    "linear-gradient(to top, hsl(220 60% 55%), hsl(200 70% 60%))";
                  let scale = "scale(1)";
                  let shadow = "none";

                  if (index === keyindex) {
                    bg =
                      "linear-gradient(to top, hsl(262 80% 55%), hsl(262 80% 70%))";
                    scale = "scale(1.05)";
                  }

                  if (comparing.includes(index)) {
                    bg = swapped
                      ? "linear-gradient(to top, hsl(0 72% 55%), hsl(0 72% 70%))"
                      : "linear-gradient(to top, hsl(40 90% 50%), hsl(40 90% 65%))";
                    scale = "scale(1.1)";
                    shadow = "0 0 20px hsl(40 90% 55% / 0.5)";
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
                      <div
                        className="text-xs font-bold mb-2 px-2 py-1 rounded-lg"
                        style={{
                          background: "hsl(220 16% 13% / 0.8)",
                        }}
                      >
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
          <div className="card p-4">
            <CodeViewer
              code={CODE}
              highlightedLine={highlightedLine}
              title="insertion-sort.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default InsertionSortPage;
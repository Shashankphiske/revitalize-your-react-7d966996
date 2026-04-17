import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const BINARY_SEARCH_CODE = [
  "function binarySearch(arr, target) {",
  "  let left = 0, right = arr.length - 1;",
  "  while (left <= right) {",
  "    const mid = Math.floor((left + right) / 2);",
  "    if (arr[mid] === target) return mid;",
  "    if (arr[mid] < target) left = mid + 1;",
  "    else right = mid - 1;",
  "  }",
  "  return -1;",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (step.found) return 4;
  if (step.left !== undefined) return 3;
  return 8;
};

const BinarySearchPage = () => {
  const [input, setInput] = useState("2,5,8,12,16,23,38,45,56,67,78");
  const [target, setTarget] = useState("23");
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);
  const highlightTimerRef = useRef(null);

  const fetchSteps = async (arr, num) => {
    const res = await fetch(
      "http://localhost/searchingalgo/binarysearch",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          arr: JSON.stringify(arr),
          num: parseInt(num),
        }),
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
        setError("Invalid array!");
        return;
      }

      if (isNaN(Number(target))) {
        setError("Invalid target!");
        return;
      }

      setError("");
      setArray(parsed);
      setCurrentStepIndex(0);
      setExplanation("Starting Binary Search...");

      const resSteps = await fetchSteps(parsed, target);
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

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;

    //Early highlighting phase (200ms)
    highlightTimerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setHighlightedLine(getHighlightedLine(step));
    }, 200);

    // Full state update phase (1800ms)
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];

      setArray(step.arr);
      setExplanation(
        step.found
          ? `🎯 Found ${target} at index ${step.mid}!`
          : `Checking mid=${step.mid}, value=${step.arr[step.mid]}`
      );

      setCurrentStepIndex((prev) => prev + 1);
    }, 1800);

    return () => {
      clearTimeout(highlightTimerRef.current);
      clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { left = -1, right = -1, mid = -1, found = false } = currentStep;

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
          icon="🔎"
          title="Binary Search"
          description="Binary Search finds a target in a sorted array by halving the search space."
          complexity={{ time: "O(log n)", space: "O(1)" }}
        />

        {/* INPUT */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Input</h3>

          <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
            <div className="flex-1">
              <label className="text-sm mb-1 block text-gray-400">
                Sorted Array
              </label>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPlaying}
                className="w-full px-4 py-3 rounded-xl"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm mb-1 block text-gray-400">
                Target
              </label>
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                disabled={isPlaying}
                className="px-4 py-3 rounded-xl w-32"
                style={inputStyle}
              />
            </div>
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

        {/* MAIN SPLIT */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* VISUALIZER */}
          <div className="card p-4 flex flex-col">
            <AlgoVisualizationContainer>
              <div className="flex justify-center items-center min-h-[300px] flex-wrap gap-3">

                {array.map((value, index) => {
                  let bg = "#1f2937";
                  let scale = "scale(0.95)";
                  let shadow = "none";

                  if (index === mid && found) {
                    bg = "#22c55e";
                    scale = "scale(1.25)";
                    shadow = "0 0 20px rgba(34,197,94,0.8)";
                  } else if (index === mid) {
                    bg = "#f59e0b";
                    scale = "scale(1.25)";
                    shadow = "0 0 20px rgba(245,158,11,0.8)";
                  } else if (index >= left && index <= right) {
                    bg = "#8b5cf6";
                    scale = "scale(1.05)";
                  }

                  return (
                    <div
                      key={index}
                      className="w-14 h-14 flex items-center justify-center rounded-xl font-bold transition-all duration-500"
                      style={{
                        background: bg,
                        transform: scale,
                        boxShadow: shadow,
                      }}
                    >
                      {value}
                    </div>
                  );
                })}

              </div>
            </AlgoVisualizationContainer>
          </div>

          {/* CODE */}
          <div className="card p-4 flex flex-col">
            <CodeViewer
              code={BINARY_SEARCH_CODE}
              highlightedLine={highlightedLine}
              title="binary-search.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default BinarySearchPage;
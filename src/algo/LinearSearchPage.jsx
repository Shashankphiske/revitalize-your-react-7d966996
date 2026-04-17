import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const LINEAR_SEARCH_CODE = [
  "function linearSearch(arr, target) {",
  "  for (let i = 0; i < arr.length; i++) {",
  "    if (arr[i] === target) {",
  "      return i;",
  "    }",
  "  }",
  "  return -1;",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (step.found) return 3;
  if (step.index >= 0) return 2;
  return 6;
};

const LinearSearchPage = () => {
  const [input, setInput] = useState("12,45,23,67,89,34,56,78,90,11");
  const [target, setTarget] = useState("56");
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
      "http://localhost:3000/searchingalgo/linearsearch",
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

    try {
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
      setExplanation("Starting Linear Search...");

      const stepsData = await fetchSteps(parsed, target);
      setSteps(stepsData);
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

    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];

      setArray(step.arr);

      setExplanation(
        step.found
          ? `Found ${target} at index ${step.index}!`
          : `Checking index ${step.index}: ${step.arr[step.index]} ≠ ${target}`
      );

      setHighlightedLine(getHighlightedLine(step));
      setCurrentStepIndex((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { index = -1, found = false } = currentStep;

  const inputStyle = {
    background: "hsl(220 20% 6%)",
    border: "1px solid hsl(220 14% 22%)",
    color: "hsl(0 0% 96%)",
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 px-4 sm:px-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER (same as BFS) */}
        <AlgoPageHeader
          icon="🔍"
          title="Linear Search"
          description="Linear Search checks each element sequentially until the target is found or the end is reached."
          complexity={{ time: "O(n)", space: "O(1)" }}
        />

        {/* INPUT CARD (BFS-style structure) */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Array Input</h3>

          <div className="flex flex-col lg:flex-row gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPlaying}
              placeholder="Enter comma-separated values"
              className="px-3 py-2 rounded-xl flex-1 text-sm"
              style={inputStyle}
            />

            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={isPlaying}
              placeholder="Target"
              className="px-3 py-2 rounded-xl w-32 text-sm"
              style={inputStyle}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* CONTROLS + EXPLANATION (same grouping as BFS) */}
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

        {/* MAIN SPLIT (same as BFS) */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* VISUALIZER */}
          <div className="card p-4 flex flex-col">
            <AlgoVisualizationContainer>
              <div className="flex justify-center items-center gap-3 flex-wrap min-h-[420px]">
                {array.map((value, idx) => {
                  let bg = "hsl(220 60% 55%)";
                  let scale = "scale(1)";
                  let shadow = "none";
                  let textColor = "hsl(220 20% 6%)";

                  if (idx === index && found) {
                    bg = "hsl(145 65% 48%)";
                    scale = "scale(1.2)";
                    shadow = "0 0 20px hsl(145 65% 48% / 0.8)";
                  } else if (idx === index) {
                    bg = "hsl(40 90% 55%)";
                    scale = "scale(1.2)";
                    shadow = "0 0 20px hsl(40 90% 55% / 0.8)";
                  } else if (idx < index) {
                    bg = "hsl(220 14% 22%)";
                    textColor = "hsl(220 10% 50%)";
                    scale = "scale(0.95)";
                  }

                  return (
                    <div
                      key={idx}
                      className="w-16 h-16 flex items-center justify-center rounded-xl transition-all duration-500 font-bold text-xl"
                      style={{
                        background: bg,
                        color: textColor,
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
              code={LINEAR_SEARCH_CODE}
              highlightedLine={highlightedLine}
              title="linear-search.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default LinearSearchPage;
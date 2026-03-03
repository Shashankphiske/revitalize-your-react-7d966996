import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";

const INSERTION_SORT_CODE = [
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

  const fetchInsertionSortSteps = async (arr) => {
    const res = await fetch("http://localhost:3000/sortingalgo/insertionsort", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ arr: JSON.stringify(arr) }),
    });
    const data = await res.json();
    return data.arr;
  };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const parsed = input.split(",").map(Number).filter((n) => !isNaN(n));
      if (parsed.length === 0) {
        setError("Invalid input! Please enter comma-separated numbers (e.g., 5,3,8,4,2)");
        return;
      }
      setError("");
      setArray(parsed);
      setCurrentStepIndex(0);
      setExplanation("Starting Insertion Sort. Selecting the first key element.");
      setHighlightedLine(2);
      const backendSteps = await fetchInsertionSortSteps(parsed);
      setSteps(backendSteps);
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
    setSteps([]);
    setArray([]);
    setCurrentStepIndex(0);
    setExplanation("");
    setError("");
    setHighlightedLine(null);
  };

  const generateExplanation = (step, prevStep) => {
    if (!step.comparing || step.comparing.length === 0) return "Insertion Sort completed. The array is fully sorted.";
    const [i, j] = step.comparing;
    if (!step.swapped) return `Comparing key ${step.arr[step.keyindex]} with ${step.arr[i]}.`;
    if (prevStep && step.keyindex !== prevStep.keyindex) return `Selected ${step.arr[step.keyindex]} as the new key element.`;
    return `Shifted ${step.arr[j]} one position to the right to make space for the key.`;
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) {
      if (isPlaying && currentStepIndex >= steps.length && steps.length > 0) {
        setHighlightedLine(10);
        setExplanation("Insertion Sort completed. The array is fully sorted.");
        setIsPlaying(false);
      }
      return;
    }
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      const prevStep = steps[currentStepIndex - 1];
      setArray(step.arr);
      setExplanation(generateExplanation(step, prevStep));
      setHighlightedLine(getHighlightedLine(step));
      setCurrentStepIndex((i) => i + 1);
    }, 1800);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { comparing = [], keyindex = null, swapped = false } = currentStep;

  return (
    <div className="min-h-screen text-white pt-24 pb-16 px-6">
      <div className="text-center max-w-4xl mx-auto mb-8">
        <div className="inline-block mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center glow">
            <span className="text-2xl">📥</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Insertion Sort</span>
        </h1>
        <div className="glass-card rounded-2xl p-6 mb-6 text-left">
          <h2 className="text-xl font-semibold mb-3 gradient-text-secondary">About Insertion Sort</h2>
          <p className="text-gray-300 text-sm mb-3 leading-relaxed">
            Insertion Sort builds the sorted array one element at a time by inserting each new element
            into its correct position among the already-sorted elements.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="glass px-4 py-2 rounded-lg">
              <span className="text-gray-400 text-xs">Time Complexity</span>
              <div className="text-yellow-400 font-semibold">O(n²)</div>
            </div>
            <div className="glass px-4 py-2 rounded-lg">
              <span className="text-gray-400 text-xs">Space Complexity</span>
              <div className="text-green-400 font-semibold">O(1)</div>
            </div>
            <div className="glass px-4 py-2 rounded-lg">
              <span className="text-gray-400 text-xs">Stability</span>
              <div className="text-blue-400 font-semibold">Stable</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-8">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <label className="text-sm text-gray-400 mb-2 block">Enter array (comma-separated numbers)</label>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPlaying}
                placeholder="e.g., 5,3,8,4,2"
                className="w-full px-4 py-3 rounded-xl glass border border-white/20 focus:border-purple-500 focus:outline-none transition-all text-white placeholder-gray-500"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              <p className="text-xs text-gray-500 mt-2">Try: 5,3,8,4,2 or 64,34,25,12,22,11,90</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handlePlay} disabled={isPlaying} className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:scale-105 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/></svg>
                Play
              </button>
              <button onClick={handlePause} disabled={!isPlaying} className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:scale-105 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zM13 4a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V4z"/></svg>
                Pause
              </button>
              <button onClick={handleReplay} className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 font-semibold hover:scale-105 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>
                Replay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-8">
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              {isPlaying ? 'Running' : 'Ready'}
            </span>
          </div>
          <p className="text-lg text-blue-300 font-medium">
            {explanation || "Click Play to start Insertion Sort visualization"}
          </p>
        </div>
      </div>

      <div className="algo-split-layout">
        <div className="algo-visualization-panel">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex justify-center items-end gap-2" style={{ minHeight: "400px" }}>
              {array.map((value, index) => {
                let bgColor = "bg-blue-500";
                let scale = "scale-100";
                let shadow = "";
                if (index === keyindex) {
                  bgColor = "bg-purple-500";
                  scale = "scale-105";
                }
                if (comparing.includes(index)) {
                  bgColor = swapped ? "bg-red-500" : "bg-yellow-400";
                  scale = "scale-110";
                  shadow = "shadow-2xl shadow-yellow-400/50";
                }
                const heightPercentage = (value / Math.max(...array)) * 100;
                return (
                  <div
                    key={index}
                    className={`w-16 flex flex-col items-center justify-end transition-all duration-500 ease-in-out ${scale} ${shadow}`}
                    style={{ height: "350px" }}
                  >
                    <div className="text-sm font-bold text-white mb-1">{value}</div>
                    <div className={`w-full rounded-t-lg transition-all duration-500 ease-in-out ${bgColor}`} style={{ height: `${heightPercentage}%` }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="algo-code-panel">
          <CodeViewer code={INSERTION_SORT_CODE} highlightedLine={highlightedLine} title="insertion-sort.js" />
        </div>
      </div>
    </div>
  );
};

export default InsertionSortPage;

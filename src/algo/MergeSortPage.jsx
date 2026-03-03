import React, { useState, useEffect, useRef } from "react";
import ControlButtons from "../ControlButtons";
import CodeViewer from "../CodeViewer";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const MERGE_SORT_CODE = [
  "function mergeSort(arr) {", "  if (arr.length <= 1) return arr;", "  const mid = Math.floor(arr.length / 2);",
  "  const left = mergeSort(arr.slice(0, mid));", "  const right = mergeSort(arr.slice(mid));",
  "  return merge(left, right);", "}", "function merge(left, right) {", "  const result = [];",
  "  while (left.length && right.length) {", "    if (left[0] <= right[0]) result.push(left.shift());",
  "    else result.push(right.shift());", "  }", "  return [...result, ...left, ...right];", "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (!step.comparing || step.comparing.length === 0) return 13;
  if (step.swapped && step.mergedIndexes && step.mergedIndexes.length > 0) return 10;
  return 9;
};

const MergeSortPage = () => {
  const [input, setInput] = useState("5,3,8,4,2");
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);
  const timerRef = useRef(null);

  const fetchMergeSortSteps = async (arr) => {
    const res = await fetch("http://localhost:3000/sortingalgo/mergesort", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ arr: JSON.stringify(arr) }) });
    return (await res.json()).arr;
  };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const parsed = input.split(",").map(Number).filter(n => !isNaN(n));
      if (parsed.length === 0) { setError("Invalid input!"); return; }
      setError(""); setArray(parsed); setCurrentStepIndex(0); setExplanation("Starting Merge Sort...");
      setSteps(await fetchMergeSortSteps(parsed));
    }
    setIsPlaying(true);
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setArray([]); setCurrentStepIndex(0); setExplanation(""); setError(""); };

  const generateExplanation = (step) => {
    if (!step.comparing || step.comparing.length === 0) return "Merge Sort completed. Array is sorted.";
    if (step.comparing.length === 2 && !step.swapped) { const [i, j] = step.comparing; return `Comparing ${step.arr[i]} and ${step.arr[j]}`; }
    if (step.swapped && step.mergedIndexes.length > 0) { const idx = step.mergedIndexes[step.mergedIndexes.length - 1]; return `Placed ${step.arr[idx]} at position ${idx}`; }
    return "Merging sorted subarrays.";
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setArray(step.arr); setExplanation(generateExplanation(step)); setHighlightedLine(getHighlightedLine(step));
      setCurrentStepIndex(i => i + 1);
    }, 1800);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { comparing = [], mergedIndexes = [], swapped = false } = currentStep;

  return (
    <div className="min-h-screen pt-32 pb-16 px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="🔀" title="Merge Sort" description="Merge Sort is a divide-and-conquer algorithm that divides the array, sorts each half, and merges them back together." complexity={{ time: "O(n log n)", space: "O(n)", stable: "Stable" }} />

      <div className="max-w-5xl mx-auto mb-8">
        <div className="card rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Enter array (comma-separated)</label>
              <input value={input} onChange={(e) => setInput(e.target.value)} disabled={isPlaying} placeholder="e.g., 5,3,8,4,2"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all" style={{ background: 'hsl(220 20% 6%)', border: '1px solid hsl(220 14% 22%)', color: 'hsl(0 0% 96%)' }} />
              {error && <p className="text-sm mt-2" style={{ color: 'hsl(0 72% 58%)' }}>{error}</p>}
              <p className="text-xs mt-2" style={{ color: 'hsl(220 10% 40%)' }}>Try: 5,3,8,4,2 or 64,34,25,12,22,11,90</p>
            </div>
          </div>
        </div>
      </div>

      <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />

      <div className="algo-split-layout">
        <div className="algo-visualization-panel">
          <AlgoVisualizationContainer>
            <div className="flex justify-center items-end gap-2" style={{ minHeight: "400px" }}>
              {array.map((value, index) => {
                let bg = "linear-gradient(to top, hsl(220 60% 55%), hsl(200 70% 60%))";
                let scale = "scale(1)"; let shadow = "none";
                if (mergedIndexes.includes(index)) { bg = "linear-gradient(to top, hsl(262 80% 55%), hsl(262 80% 70%))"; scale = "scale(1.05)"; shadow = "0 0 15px hsl(262 80% 55% / 0.5)"; }
                if (comparing.includes(index)) { bg = swapped ? "linear-gradient(to top, hsl(0 72% 55%), hsl(0 72% 70%))" : "linear-gradient(to top, hsl(40 90% 50%), hsl(40 90% 65%))"; scale = "scale(1.1)"; shadow = "0 0 20px hsl(40 90% 55% / 0.5)"; }
                const h = (value / Math.max(...array)) * 100;
                return (
                  <div key={index} className="w-16 flex flex-col items-center justify-end transition-all duration-500" style={{ height: "350px", transform: scale }}>
                    <div className="text-sm font-bold mb-2 px-2 py-1 rounded-lg" style={{ background: 'hsl(220 16% 13% / 0.8)', color: 'hsl(0 0% 96%)' }}>{value}</div>
                    <div className="w-full rounded-t-xl transition-all duration-500 relative overflow-hidden" style={{ height: `${h}%`, background: bg, boxShadow: shadow }} />
                  </div>
                );
              })}
            </div>
          </AlgoVisualizationContainer>
        </div>
        <div className="algo-code-panel"><CodeViewer code={MERGE_SORT_CODE} highlightedLine={highlightedLine} title="merge-sort.js" /></div>
      </div>
    </div>
  );
};

export default MergeSortPage;

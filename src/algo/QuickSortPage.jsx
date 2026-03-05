import React, { useState, useEffect, useRef } from "react";
import ControlButtons from "../ControlButtons";
import CodeViewer from "../CodeViewer";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const QUICK_SORT_CODE = [
  "function quickSort(arr, lo, hi) {", "  if (lo < hi) {", "    const p = partition(arr, lo, hi);",
  "    quickSort(arr, lo, p - 1);", "    quickSort(arr, p + 1, hi);", "  }", "}",
  "function partition(arr, lo, hi) {", "  const pivot = arr[hi];", "  let i = lo - 1;",
  "  for (let j = lo; j < hi; j++) {", "    if (arr[j] < pivot) {", "      i++;",
  "      [arr[i], arr[j]] = [arr[j], arr[i]];", "    }", "  }",
  "  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];", "  return i + 1;", "}",
];

const QuickSortPage = () => {
  const [input, setInput] = useState("5,3,8,4,2");
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");
  const timerRef = useRef(null);

  const fetchQuickSortSteps = async (arr) => {
    const res = await fetch("http://localhost:3000/sortingalgo/quicksort", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ arr: JSON.stringify(arr) }) });
    return (await res.json()).arr;
  };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const parsed = input.split(",").map((n) => Number(n.trim())).filter((n) => !isNaN(n));
      if (parsed.length === 0) { setError("Invalid input!"); return; }
      setError(""); setArray(parsed); setCurrentStepIndex(0); setExplanation("Starting Quick Sort...");
      setSteps(await fetchQuickSortSteps(parsed));
    }
    setIsPlaying(true);
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setArray([]); setCurrentStepIndex(0); setError(""); setExplanation(""); };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setArray(step.arr);
      setExplanation(step.comparing?.length ? (step.swapped ? "Swapping elements..." : "Comparing elements...") : "Quick Sort completed.");
      setCurrentStepIndex((prev) => prev + 1);
    }, 1800);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { comparing = [], pivotIndex = null, swapped = false } = currentStep;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 px-3 sm:px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="⚡" title="Quick Sort" description="Quick Sort selects a pivot element and partitions the array so elements smaller come before it, and greater after. Applied recursively." complexity={{ time: "O(n log n)", space: "O(log n)", stable: "Unstable" }} />

      <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
        <div className="card rounded-2xl p-4 sm:p-6">
          <label className="text-xs sm:text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Enter array</label>
          <input value={input} onChange={(e) => setInput(e.target.value)} disabled={isPlaying} placeholder="e.g., 5,3,8,4,2"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm" style={{ background: 'hsl(220 20% 6%)', border: '1px solid hsl(220 14% 22%)', color: 'hsl(0 0% 96%)' }} />
          {error && <p className="text-sm mt-2" style={{ color: 'hsl(0 72% 58%)' }}>{error}</p>}
        </div>
      </div>

      <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />

      <div className="max-w-6xl mx-auto">
        <AlgoVisualizationContainer>
          <div className="flex justify-center items-end gap-1 sm:gap-2 algo-bar-container" style={{ minHeight: "300px" }}>
            {array.map((value, index) => {
              let bg = "linear-gradient(to top, hsl(220 60% 55%), hsl(200 70% 60%))";
              let scale = "scale(1)"; let shadow = "none";
              if (index === pivotIndex) { bg = "linear-gradient(to top, hsl(262 80% 55%), hsl(262 80% 70%))"; scale = "scale(1.1)"; shadow = "0 0 20px hsl(262 80% 55% / 0.5)"; }
              if (comparing.includes(index)) { bg = swapped ? "linear-gradient(to top, hsl(0 72% 55%), hsl(0 72% 70%))" : "linear-gradient(to top, hsl(40 90% 50%), hsl(40 90% 65%))"; scale = "scale(1.1)"; shadow = "0 0 20px hsl(40 90% 55% / 0.5)"; }
              const h = (value / Math.max(...array)) * 100;
              return (
                <div key={index} className="algo-bar flex flex-col items-center justify-end transition-all duration-500" style={{ height: "280px", width: "3.5rem", transform: scale }}>
                  <div className="text-xs sm:text-sm font-bold mb-1 sm:mb-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg" style={{ background: 'hsl(220 16% 13% / 0.8)', color: 'hsl(0 0% 96%)' }}>{value}</div>
                  <div className="w-full rounded-t-xl transition-all duration-500" style={{ height: `${h}%`, background: bg, boxShadow: shadow }} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm flex-wrap" style={{ color: 'hsl(220 10% 60%)' }}>
            <div className="flex items-center gap-2"><span className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ background: 'hsl(220 60% 55%)' }} /> Unsorted</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ background: 'hsl(262 80% 55%)' }} /> Pivot</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ background: 'hsl(40 90% 55%)' }} /> Comparing</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ background: 'hsl(0 72% 55%)' }} /> Swapping</div>
          </div>
        </AlgoVisualizationContainer>
      </div>
    </div>
  );
};

export default QuickSortPage;

import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const CODE = ["function selectionSort(arr) {", "  for (let i = 0; i < arr.length - 1; i++) {", "    let minIdx = i;", "    for (let j = i + 1; j < arr.length; j++) {", "      if (arr[j] < arr[minIdx]) {", "        minIdx = j;", "      }", "    }", "    if (minIdx !== i) {", "      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];", "    }", "  }", "  return arr;", "}"];
const getHighlightedLine = (step) => { if (!step) return null; if (!step.comparing || step.comparing.length === 0) return 13; if (step.swapped) return 9; return 4; };

const SelectionSortPage = () => {
  const [input, setInput] = useState("5,3,8,4,2");
  const [array, setArray] = useState([]); const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState(""); const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null); const timerRef = useRef(null);

  const fetchSteps = async (arr) => { const res = await fetch("http://localhost:3000/sortingalgo/selectionsort", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ arr: JSON.stringify(arr) }) }); return (await res.json()).arr; };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const parsed = input.split(",").map((n) => Number(n.trim())).filter((n) => !isNaN(n));
      if (parsed.length === 0) { setError("Invalid input!"); return; }
      setError(""); setArray(parsed); setCurrentStepIndex(0); setExplanation("Starting Selection Sort..."); setHighlightedLine(1);
      setSteps(await fetchSteps(parsed));
    }
    setIsPlaying(true);
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setArray([]); setCurrentStepIndex(0); setExplanation(""); setError(""); setHighlightedLine(null); };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) {
      if (isPlaying && currentStepIndex >= steps.length && steps.length > 0) { setHighlightedLine(13); setExplanation("Selection Sort completed."); setIsPlaying(false); }
      return;
    }
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setArray(step.arr);
      setExplanation(!step.comparing?.length ? "Completed." : step.swapped ? "Swapping elements..." : "Finding minimum...");
      setHighlightedLine(getHighlightedLine(step)); setCurrentStepIndex((prev) => prev + 1);
    }, 1800);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { comparing = [], selectedmin = null, swapped = false } = currentStep;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 px-3 sm:px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="🔍" title="Selection Sort" description="Selection Sort repeatedly selects the minimum from the unsorted part and swaps it with the first unsorted element." complexity={{ time: "O(n²)", space: "O(1)", stable: "Unstable" }} />
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
      <div className="algo-split-layout">
        <div className="algo-visualization-panel">
          <AlgoVisualizationContainer>
            <div className="flex justify-center items-end gap-1 sm:gap-2 algo-bar-container" style={{ minHeight: "300px" }}>
              {array.map((value, index) => {
                let bg = "linear-gradient(to top, hsl(220 60% 55%), hsl(200 70% 60%))"; let scale = "scale(1)"; let shadow = "none";
                if (index === selectedmin) { bg = "linear-gradient(to top, hsl(262 80% 55%), hsl(262 80% 70%))"; scale = "scale(1.05)"; }
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
          </AlgoVisualizationContainer>
        </div>
        <div className="algo-code-panel"><CodeViewer code={CODE} highlightedLine={highlightedLine} title="selection-sort.js" /></div>
      </div>
    </div>
  );
};

export default SelectionSortPage;

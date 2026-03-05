import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const BUBBLE_SORT_CODE = ["function bubbleSort(arr) {", "  for (let i = 0; i < arr.length - 1; i++) {", "    for (let j = 0; j < arr.length - i - 1; j++) {", '      if (arr[j] > arr[j + 1]) {', "        let temp = arr[j];", "        arr[j] = arr[j + 1];", "        arr[j + 1] = temp;", "      }", "    }", "  }", "  return arr;", "}"];
const getHighlightedLine = (step) => { if (!step) return null; if (!step.comparing || step.comparing.length === 0) return 10; return step.swapped ? 4 : 3; };

const BubbleSortPage = () => {
  const [input, setInput] = useState("5,3,8,4,2");
  const [array, setArray] = useState([]); const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState(""); const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null); const timerRef = useRef(null);

  const fetchSteps = async (arr) => { const res = await fetch("http://localhost:3000/sortingalgo/bubblesort", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ arr: JSON.stringify(arr) }) }); return (await res.json()).arr; };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const parsed = input.split(",").map((n) => Number(n.trim())).filter((n) => !isNaN(n));
      if (parsed.length === 0) { setError("Invalid input!"); return; }
      setError(""); setArray(parsed); setCurrentStepIndex(0); setExplanation("Starting Bubble Sort...");
      setSteps(await fetchSteps(parsed));
    }
    setIsPlaying(true);
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setArray([]); setCurrentStepIndex(0); setExplanation(""); setError(""); setHighlightedLine(null); };

  const generateExplanation = (step) => {
    if (!step.comparing || step.comparing.length === 0) return "Bubble Sort completed.";
    const [i, j] = step.comparing; const a = step.arr;
    return step.swapped ? `Swapped ${a[j]} and ${a[i]}` : `Comparing ${a[i]} and ${a[j]} — no swap needed`;
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) {
      if (isPlaying && currentStepIndex >= steps.length && steps.length > 0) { setExplanation("Bubble Sort completed."); setIsPlaying(false); }
      return;
    }
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setArray(step.arr); setExplanation(generateExplanation(step)); setHighlightedLine(getHighlightedLine(step));
      setCurrentStepIndex((prev) => prev + 1);
    }, 2000);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { comparing = [], swapped = false } = currentStep;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 px-3 sm:px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="🫧" title="Bubble Sort" description="Bubble Sort repeatedly compares adjacent elements and swaps them if they're in the wrong order. Larger elements 'bubble' to the end." complexity={{ time: "O(n²)", space: "O(1)", stable: "Stable" }} />
      <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
        <div className="card rounded-2xl p-4 sm:p-6">
          <label className="text-xs sm:text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Enter array</label>
          <input value={input} onChange={(e) => setInput(e.target.value)} disabled={isPlaying} placeholder="e.g., 5,3,8,4,2"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm" style={{ background: 'hsl(220 20% 6%)', border: '1px solid hsl(220 14% 22%)', color: 'hsl(0 0% 96%)' }} />
          {error && <p className="text-sm mt-2" style={{ color: 'hsl(0 72% 58%)' }}>{error}</p>}
          <p className="text-xs mt-2" style={{ color: 'hsl(220 10% 40%)' }}>Try: 5,3,8,4,2 or 64,34,25,12,22,11,90</p>
        </div>
      </div>
      <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
      <div className="algo-split-layout">
        <div className="algo-visualization-panel">
          <AlgoVisualizationContainer>
            <div className="flex justify-center items-end gap-1 sm:gap-2 algo-bar-container" style={{ minHeight: "300px" }}>
              {array.map((value, index) => {
                let bg = "linear-gradient(to top, hsl(220 60% 55%), hsl(200 70% 60%))";
                let scale = "scale(1)"; let shadow = "none";
                if (comparing.includes(index)) {
                  bg = swapped ? "linear-gradient(to top, hsl(0 72% 55%), hsl(0 72% 70%))" : "linear-gradient(to top, hsl(40 90% 50%), hsl(40 90% 65%))";
                  scale = "scale(1.1)"; shadow = swapped ? "0 0 20px hsl(0 72% 55% / 0.5)" : "0 0 20px hsl(40 90% 55% / 0.5)";
                }
                const h = (value / Math.max(...array)) * 100;
                return (
                  <div key={index} className="algo-bar flex flex-col items-center justify-end transition-all duration-500" style={{ height: "280px", width: "3.5rem", transform: scale }}>
                    <div className="text-xs sm:text-sm font-bold mb-1 sm:mb-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg" style={{ background: 'hsl(220 16% 13% / 0.8)', color: 'hsl(0 0% 96%)' }}>{value}</div>
                    <div className="w-full rounded-t-xl transition-all duration-500 relative overflow-hidden" style={{ height: `${h}%`, background: bg, boxShadow: shadow }}>
                      <div className="absolute inset-0 bg-white/20 shimmer" />
                    </div>
                  </div>
                );
              })}
            </div>
          </AlgoVisualizationContainer>
        </div>
        <div className="algo-code-panel"><CodeViewer code={BUBBLE_SORT_CODE} highlightedLine={highlightedLine} title="bubble-sort.js" /></div>
      </div>
    </div>
  );
};

export default BubbleSortPage;

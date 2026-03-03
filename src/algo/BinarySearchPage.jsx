import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const BINARY_SEARCH_CODE = [
  "function binarySearch(arr, target) {", "  let left = 0, right = arr.length - 1;", "  while (left <= right) {",
  "    const mid = Math.floor((left + right) / 2);", "    if (arr[mid] === target) return mid;",
  "    if (arr[mid] < target) left = mid + 1;", "    else right = mid - 1;", "  }", "  return -1;", "}",
];

const getHighlightedLine = (step) => { if (!step) return null; if (step.found) return 4; if (step.left !== undefined) return 3; return 8; };

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

  const fetchSteps = async (arr, num) => {
    const res = await fetch("http://localhost:3000/searchingalgo/binarysearch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ arr: JSON.stringify(arr), num: parseInt(num) }) });
    return (await res.json()).arr;
  };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const parsed = input.split(",").map(n => Number(n.trim())).filter(n => !isNaN(n));
      if (parsed.length === 0) { setError("Invalid array!"); return; }
      if (isNaN(Number(target))) { setError("Invalid target!"); return; }
      setError(""); setArray(parsed); setCurrentStepIndex(0); setExplanation("Starting Binary Search...");
      setSteps(await fetchSteps(parsed, target));
    }
    setIsPlaying(true);
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setArray([]); setCurrentStepIndex(0); setExplanation(""); setError(""); };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setArray(step.arr);
      setExplanation(step.found ? `Found ${target} at index ${step.mid}!` : `Checking mid=${step.mid}, value=${step.arr[step.mid]}`);
      setHighlightedLine(getHighlightedLine(step));
      setCurrentStepIndex((prev) => prev + 1);
    }, 1500);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const { left = -1, right = -1, mid = -1, found = false } = currentStep;
  const inputStyle = { background: 'hsl(220 20% 6%)', border: '1px solid hsl(220 14% 22%)', color: 'hsl(0 0% 96%)' };

  return (
    <div className="min-h-screen pt-32 pb-16 px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="🔎" title="Binary Search" description="Binary Search efficiently finds a target in a sorted array by repeatedly dividing the search interval in half." complexity={{ time: "O(log n)", space: "O(1)" }} />

      <div className="max-w-5xl mx-auto mb-8">
        <div className="card rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="flex-1">
              <label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Sorted array</label>
              <input value={input} onChange={(e) => setInput(e.target.value)} disabled={isPlaying} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Target</label>
              <input value={target} onChange={(e) => setTarget(e.target.value)} disabled={isPlaying} className="px-4 py-3 rounded-xl w-32 outline-none" style={inputStyle} />
            </div>
          </div>
          {error && <p className="text-sm mt-2" style={{ color: 'hsl(0 72% 58%)' }}>{error}</p>}
        </div>
      </div>

      <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />

      <div className="algo-split-layout">
        <div className="algo-visualization-panel">
          <AlgoVisualizationContainer>
            <div className="flex justify-center items-center gap-3 flex-wrap">
              {array.map((value, index) => {
                let bg = "hsl(220 14% 22%)"; let border = "hsl(220 14% 22%)"; let textColor = "hsl(220 10% 60%)"; let scale = "scale(0.95)"; let shadow = "none";
                if (index === mid && found) { bg = "hsl(145 65% 48%)"; border = "hsl(145 65% 48%)"; textColor = "hsl(220 20% 6%)"; scale = "scale(1.25)"; shadow = "0 0 20px hsl(145 65% 48% / 0.8)"; }
                else if (index === mid) { bg = "hsl(40 90% 55%)"; border = "hsl(40 90% 55%)"; textColor = "hsl(220 20% 6%)"; scale = "scale(1.25)"; shadow = "0 0 20px hsl(40 90% 55% / 0.8)"; }
                else if (index >= left && index <= right) { bg = "hsl(262 80% 55%)"; border = "hsl(262 80% 55%)"; textColor = "hsl(0 0% 96%)"; scale = "scale(1.05)"; }
                return (
                  <div key={index} className="w-16 h-16 flex flex-col items-center justify-center rounded-xl transition-all duration-500 font-bold text-xl"
                    style={{ background: bg, color: textColor, transform: scale, boxShadow: shadow, border: `1px solid ${border}` }}>
                    {value}
                  </div>
                );
              })}
            </div>
          </AlgoVisualizationContainer>
        </div>
        <div className="algo-code-panel"><CodeViewer code={BINARY_SEARCH_CODE} highlightedLine={highlightedLine} title="binary-search.js" /></div>
      </div>
    </div>
  );
};

export default BinarySearchPage;

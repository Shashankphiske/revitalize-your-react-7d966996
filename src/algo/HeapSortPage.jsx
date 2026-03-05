import React, { useState, useEffect, useRef } from "react";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const LEVEL_HEIGHT = 80;

const HeapSortPage = () => {
  const [input, setInput] = useState("5,3,8,4,2");
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getPosition = (index) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelStart = Math.pow(2, level) - 1;
    const posInLevel = index - levelStart;
    const nodesInLevel = Math.pow(2, level);
    const gap = containerWidth / nodesInLevel;
    return { x: gap * posInLevel + gap / 2, y: level * LEVEL_HEIGHT + 40 };
  };

  const fetchHeapSortSteps = async (arr) => {
    const res = await fetch("http://localhost:3000/sortingalgo/heapsort", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ arr: JSON.stringify(arr) }) });
    return (await res.json()).arr;
  };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const parsed = input.split(",").map(Number).filter((n) => !isNaN(n));
      if (parsed.length === 0) { setError("Invalid input!"); return; }
      setError(""); setArray(parsed); setCurrentStepIndex(0); setExplanation("Building max heap...");
      setSteps(await fetchHeapSortSteps(parsed));
    }
    setIsPlaying(true);
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setArray([]); setCurrentStepIndex(0); setExplanation(""); setError(""); };

  const generateExplanation = (step, prevStep) => {
    if (!step.comparing || step.comparing.length === 0) return "Heap Sort completed.";
    const [i, j] = step.comparing;
    if (!step.swapped) return `Comparing parent ${step.arr[i]} with child ${step.arr[j]}`;
    if (prevStep && step.heapRange < prevStep.heapRange) return "Moved max to sorted position.";
    return `Swapped ${step.arr[i]} and ${step.arr[j]}`;
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex]; const prevStep = steps[currentStepIndex - 1];
      setArray(step.arr); setExplanation(generateExplanation(step, prevStep)); setCurrentStepIndex((i) => i + 1);
    }, 1800);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const step = steps[currentStepIndex - 1] || {};
  const { comparing = [], heapRange = array.length, swapped = false } = step;
  const nodeSize = containerWidth < 500 ? 36 : 48;
  const maxLevel = array.length > 0 ? Math.floor(Math.log2(array.length)) : 0;
  const svgHeight = (maxLevel + 1) * LEVEL_HEIGHT + 80;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 px-3 sm:px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="🌳" title="Heap Sort" description="Heap Sort uses a binary heap. The array is converted into a max heap, then the root is repeatedly removed and placed at the end." complexity={{ time: "O(n log n)", space: "O(1)", stable: "Unstable" }} />

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

      <AlgoVisualizationContainer>
        <div ref={containerRef} className="relative w-full overflow-x-auto" style={{ minHeight: svgHeight }}>
          <svg className="absolute top-0 left-0 w-full" style={{ height: svgHeight }}>
            {array.map((_, i) => {
              const left = 2 * i + 1; const right = 2 * i + 2; const from = getPosition(i);
              return (
                <React.Fragment key={i}>
                  {left < heapRange && <line x1={from.x} y1={from.y} x2={getPosition(left).x} y2={getPosition(left).y} stroke="hsl(220 14% 22%)" strokeWidth="1.5" />}
                  {right < heapRange && <line x1={from.x} y1={from.y} x2={getPosition(right).x} y2={getPosition(right).y} stroke="hsl(220 14% 22%)" strokeWidth="1.5" />}
                </React.Fragment>
              );
            })}
          </svg>
          {array.map((value, index) => {
            const { x, y } = getPosition(index);
            let bg = "hsl(220 60% 55%)"; let scale = "scale(1)"; let shadow = "none";
            if (index >= heapRange) { bg = "hsl(145 65% 48%)"; scale = "scale(0.95)"; }
            if (comparing.includes(index)) { bg = swapped ? "hsl(0 72% 58%)" : "hsl(40 90% 55%)"; scale = "scale(1.25)"; shadow = "0 0 20px hsl(40 90% 55% / 0.8)"; }
            return (
              <div key={index} className="absolute rounded-full flex items-center justify-center font-bold transition-all duration-500 text-xs sm:text-sm"
                style={{ left: x - nodeSize / 2, top: y - nodeSize / 2 + 10, width: nodeSize, height: nodeSize, background: bg, transform: scale, boxShadow: shadow, color: 'hsl(220 20% 6%)' }}>{value}</div>
            );
          })}
        </div>
      </AlgoVisualizationContainer>
    </div>
  );
};

export default HeapSortPage;

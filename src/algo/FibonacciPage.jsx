import React, { useState, useEffect, useRef } from "react";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const FibonacciPage = () => {
  const [n, setN] = useState(8);
  const [steps, setSteps] = useState([]); const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  const fetchSteps = async () => { const res = await fetch("http://localhost:3000/dynamicalgo/fibonacci", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ n }) }); return res.json(); };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const data = await fetchSteps();
      setSteps(data.steps || []); setResult(data.result); setCurrentStepIndex(0); setExplanation("Starting Fibonacci DP...");
    }
    setIsPlaying(true);
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setCurrentStepIndex(0); setExplanation(""); setResult(null); };

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex < steps.length) {
      timerRef.current = setTimeout(() => { setExplanation(steps[currentStepIndex]?.explanation || ""); setCurrentStepIndex((prev) => prev + 1); }, 1000);
    } else { setExplanation("✅ Fibonacci computation complete"); setIsPlaying(false); }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const dp = steps.length > 0 && currentStepIndex > 0 ? steps[Math.min(currentStepIndex - 1, steps.length - 1)].dpSnapshot : Array(n + 1).fill(0);
  const activeStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  const inputStyle = { background: 'hsl(220 20% 6%)', border: '1px solid hsl(220 14% 22%)', color: 'hsl(0 0% 96%)' };

  return (
    <div className="min-h-screen pt-32 pb-16 px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="🔢" title="Fibonacci (Dynamic Programming)" description="Each Fibonacci number is the sum of the two preceding numbers. DP optimizes by storing previously computed results." complexity={{ time: "O(n)", space: "O(n)" }} />
      <div className="max-w-5xl mx-auto mb-8">
        <div className="card rounded-2xl p-6">
          <label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Enter n (0-20)</label>
          <input type="number" min="0" max="20" value={n} disabled={isPlaying} onChange={(e) => setN(Number(e.target.value))}
            className="px-4 py-3 rounded-xl w-40 outline-none" style={inputStyle} />
        </div>
      </div>
      <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
      <AlgoVisualizationContainer>
        <div className="flex justify-center gap-3 flex-wrap">
          {dp.map((value, index) => {
            let bg = "hsl(220 16% 13%)"; let border = "hsl(220 14% 18%)"; let textColor = "hsl(0 0% 96%)";
            if (activeStep?.index === index) { bg = "hsl(40 90% 55%)"; textColor = "hsl(220 20% 6%)"; border = "hsl(40 90% 55%)"; }
            if (activeStep?.from?.includes(index)) { bg = "hsl(262 80% 55%)"; textColor = "hsl(0 0% 96%)"; border = "hsl(262 80% 55%)"; }
            return (
              <div key={index} className="w-16 h-16 flex flex-col items-center justify-center rounded-xl transition-all duration-300" style={{ background: bg, border: `1px solid ${border}`, color: textColor }}>
                <div className="text-xs" style={{ color: 'hsl(220 10% 50%)' }}>dp[{index}]</div>
                <div className="text-xl font-bold">{value}</div>
              </div>
            );
          })}
        </div>
        {!isPlaying && result !== null && (
          <div className="mt-8 text-center text-xl font-semibold" style={{ color: 'hsl(145 65% 48%)' }}>Fibonacci({n}) = {result}</div>
        )}
      </AlgoVisualizationContainer>
    </div>
  );
};

export default FibonacciPage;

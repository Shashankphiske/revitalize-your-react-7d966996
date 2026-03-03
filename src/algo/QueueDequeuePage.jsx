import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const CODE = ["function dequeue(queue) {", "  if (queue.front > queue.rear) return 'underflow';", "  return queue[queue.front++];", "}"];
const getHighlightedLine = (step) => { if (!step) return null; if (step.action === "dequeue-start" || step.action === "dequeue-complete") return 2; return null; };

const QueueDequeuePage = () => {
  const [initialQueue, setInitialQueue] = useState("10,20,30,40,50"); const [dequeueCount, setDequeueCount] = useState("2");
  const [steps, setSteps] = useState([]); const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); const [explanation, setExplanation] = useState("");
  const [error, setError] = useState(""); const [highlightedLine, setHighlightedLine] = useState(null);
  const timerRef = useRef(null);

  const fetchSteps = async (queue, count) => { const res = await fetch("http://localhost:3000/queuealgo/dequeue", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ queue, dequeue: Array(count).fill(0) }) }); return (await res.json()).steps; };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const queue = initialQueue.split(",").map((n) => Number(n.trim())).filter((n) => !isNaN(n));
      if (queue.length === 0) { setError("Invalid queue!"); return; }
      setError(""); setCurrentStepIndex(0); setExplanation("Starting Dequeue...");
      setSteps(await fetchSteps(queue, parseInt(dequeueCount)));
    }
    setIsPlaying(true);
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setCurrentStepIndex(0); setExplanation(""); setError(""); };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setExplanation(step.action === "dequeue-start" ? `Dequeuing ${step.pointer.current}...` : "Dequeued!");
      setHighlightedLine(getHighlightedLine(step)); setCurrentStepIndex((prev) => prev + 1);
    }, 1500);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const inputStyle = { background: 'hsl(220 20% 6%)', border: '1px solid hsl(220 14% 22%)', color: 'hsl(0 0% 96%)' };

  return (
    <div className="min-h-screen pt-32 pb-16 px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="⬅️" title="Queue Dequeue" description="Dequeue removes an element from the front of the queue (FIFO – First In First Out)." complexity={{ time: "O(1)", space: "O(1)" }} />
      <div className="max-w-5xl mx-auto mb-8">
        <div className="card rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1"><label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Initial Queue</label><input value={initialQueue} onChange={(e) => setInitialQueue(e.target.value)} disabled={isPlaying} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} /></div>
            <div><label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Dequeue Count</label><input type="number" min="1" value={dequeueCount} onChange={(e) => setDequeueCount(e.target.value)} disabled={isPlaying} className="px-4 py-3 rounded-xl w-32 outline-none" style={inputStyle} /></div>
          </div>
          {error && <p className="text-sm mt-2" style={{ color: 'hsl(0 72% 58%)' }}>{error}</p>}
        </div>
      </div>
      <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
      <div className="algo-split-layout">
        <div className="algo-visualization-panel">
          <AlgoVisualizationContainer>
            <h3 className="text-lg font-semibold mb-4 text-center gradient-text-secondary">Queue (Front → Rear)</h3>
            <div className="flex items-center justify-center gap-2">
              {currentStep.list && currentStep.list.map((value, idx) => {
                let bg = "hsl(220 60% 55%)"; let scale = "scale(1)"; let shadow = "none";
                if (currentStep.highlight && currentStep.highlight.includes(value)) {
                  if (currentStep.action === "dequeue-start") { bg = "hsl(0 72% 58%)"; scale = "scale(1.25)"; shadow = "0 0 20px hsl(0 72% 58% / 0.8)"; }
                  else { bg = "hsl(40 90% 55%)"; scale = "scale(1.25)"; shadow = "0 0 20px hsl(40 90% 55% / 0.8)"; }
                }
                return (<div key={idx} className="w-20 h-14 flex items-center justify-center text-xl font-bold rounded-xl transition-all duration-500" style={{ background: bg, color: 'hsl(220 20% 6%)', transform: scale, boxShadow: shadow }}>{value}</div>);
              })}
            </div>
            {currentStep.list?.length > 0 && <div className="flex justify-between mt-4 text-xs px-4" style={{ color: 'hsl(220 10% 40%)' }}><span>← Front</span><span>Rear →</span></div>}
          </AlgoVisualizationContainer>
        </div>
        <div className="algo-code-panel"><CodeViewer code={CODE} highlightedLine={highlightedLine} title="queue-dequeue.js" /></div>
      </div>
    </div>
  );
};

export default QueueDequeuePage;

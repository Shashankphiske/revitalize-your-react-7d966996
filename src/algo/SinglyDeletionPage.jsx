import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const CODE = ["function deleteNode(head, value) {", "  if (head.value === value)", "    return head.next;", "  let curr = head;", "  while (curr.next) {", "    if (curr.next.value === value) {", "      curr.next = curr.next.next;", "      return head;", "    }", "    curr = curr.next;", "  }", "  return head;", "}"];
const getHighlightedLine = (step) => { if (!step) return null; if (step.action === "delete-complete") return 6; if (step.current !== null && step.current !== undefined) return 9; return null; };

const SinglyDeletionPage = () => {
  const [initialList, setInitialList] = useState("10,20,30,40,50"); const [deleteIndex, setDeleteIndex] = useState("2");
  const [steps, setSteps] = useState([]); const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); const [explanation, setExplanation] = useState("");
  const [error, setError] = useState(""); const [highlightedLine, setHighlightedLine] = useState(null);
  const timerRef = useRef(null);

  const fetchSteps = async (arr, index) => { const res = await fetch("http://localhost:3000/linkedlist/singlydeletion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ arr, index: parseInt(index) }) }); return (await res.json()).steps; };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const arr = initialList.split(",").map((n) => Number(n.trim())).filter((n) => !isNaN(n));
      const index = parseInt(deleteIndex);
      if (arr.length === 0) { setError("Invalid list!"); return; }
      if (isNaN(index) || index < 0 || index >= arr.length) { setError(`Index must be 0-${arr.length - 1}`); return; }
      setError(""); setCurrentStepIndex(0); setExplanation("Starting Deletion...");
      setSteps(await fetchSteps(arr, deleteIndex));
    }
    setIsPlaying(true);
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setCurrentStepIndex(0); setExplanation(""); setError(""); };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setExplanation(step.current ? `Deleting at index ${deleteIndex}...` : "Deletion complete!");
      setHighlightedLine(getHighlightedLine(step)); setCurrentStepIndex((prev) => prev + 1);
    }, 1500);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};
  const inputStyle = { background: 'hsl(220 20% 6%)', border: '1px solid hsl(220 14% 22%)', color: 'hsl(0 0% 96%)' };

  return (
    <div className="min-h-screen pt-32 pb-16 px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="✂️" title="Singly Linked List – Deletion" description="Deletion adjusts pointers to remove a node at the specified position." complexity={{ time: "O(n)", space: "O(1)" }} />
      <div className="max-w-5xl mx-auto mb-8">
        <div className="card rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1"><label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>List</label><input value={initialList} onChange={(e) => setInitialList(e.target.value)} disabled={isPlaying} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} /></div>
            <div><label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Delete Index</label><input value={deleteIndex} onChange={(e) => setDeleteIndex(e.target.value)} disabled={isPlaying} className="px-4 py-3 rounded-xl w-32 outline-none" style={inputStyle} /></div>
          </div>
          {error && <p className="text-sm mt-2" style={{ color: 'hsl(0 72% 58%)' }}>{error}</p>}
        </div>
      </div>
      <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
      <div className="algo-split-layout">
        <div className="algo-visualization-panel">
          <AlgoVisualizationContainer>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {currentStep.list && currentStep.list.map((value, idx) => {
                let bg = "hsl(220 60% 55%)"; let scale = "scale(1)"; let shadow = "none";
                if (currentStep.current === value) { bg = "hsl(0 72% 58%)"; scale = "scale(1.25)"; shadow = "0 0 20px hsl(0 72% 58% / 0.8)"; }
                return (<React.Fragment key={idx}><div className="w-20 h-14 flex items-center justify-center text-xl font-bold rounded-xl transition-all duration-500" style={{ background: bg, color: 'hsl(220 20% 6%)', transform: scale, boxShadow: shadow }}>{value}</div>{idx < currentStep.list.length - 1 && <span className="text-2xl" style={{ color: 'hsl(220 10% 40%)' }}>→</span>}</React.Fragment>);
              })}
            </div>
          </AlgoVisualizationContainer>
        </div>
        <div className="algo-code-panel"><CodeViewer code={CODE} highlightedLine={highlightedLine} title="singly-deletion.js" /></div>
      </div>
    </div>
  );
};

export default SinglyDeletionPage;

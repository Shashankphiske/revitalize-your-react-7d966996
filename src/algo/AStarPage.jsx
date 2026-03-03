import React, { useState, useEffect, useRef } from "react";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const AStarPage = () => {
  const [nodes, setNodes] = useState([
    { node: "A", neighbors: "B:4,C:2", h: 7 }, { node: "B", neighbors: "A:4,C:1,D:5", h: 6 },
    { node: "C", neighbors: "A:2,B:1,D:8", h: 2 }, { node: "D", neighbors: "B:5,C:8", h: 0 },
  ]);
  const [start, setStart] = useState("A"); const [end, setEnd] = useState("D");
  const [steps, setSteps] = useState([]); const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");
  const timerRef = useRef(null);

  const buildAdjAndHeuristic = () => { const adj = {}, heuristic = {}; for (let item of nodes) { const u = item.node.trim(); if (!u) continue; heuristic[u] = Number(item.h) || 0; adj[u] = {}; item.neighbors.split(",").map(x => x.trim()).filter(Boolean).forEach(pair => { const [v, w] = pair.split(":"); if (v && !isNaN(Number(w))) adj[u][v.trim()] = Number(w); }); } return { adj, heuristic }; };

  const fetchSteps = async (adj, start, end, heuristic) => { const res = await fetch("http://localhost:3000/shortestpathrouter/astaralgo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adj, start, end, heuristic }) }); return (await res.json()).arr; };

  const handlePlay = async () => {
    if (isPlaying) return;
    try {
      const { adj, heuristic } = buildAdjAndHeuristic();
      if (!adj[start] || !adj[end]) { setError("Start or end node missing."); return; }
      for (let u in adj) { for (let v in adj[u]) { if (!adj[v]) { setError(`Neighbor "${v}" not defined.`); return; } } }
      setError(""); setSteps([]); setCurrentStepIndex(0); setExplanation("Starting A*...");
      setSteps(await fetchSteps(adj, start, end, heuristic)); setIsPlaying(true);
    } catch { setError("Invalid graph."); }
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setCurrentStepIndex(0); setExplanation(""); };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setExplanation(step.found ? `Target "${end}" reached!` : `Visiting ${step.currentNode}`);
      setCurrentStepIndex(i => i + 1);
    }, 1800);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const step = steps[currentStepIndex - 1] || {};
  const { adj } = buildAdjAndHeuristic(); const nodeKeys = Object.keys(adj);
  const radius = 170, cx = 280, cy = 240; const positions = {};
  nodeKeys.forEach((node, i) => { const angle = (2 * Math.PI * i) / nodeKeys.length; positions[node] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }; });
  const inputStyle = { background: 'hsl(220 20% 6%)', border: '1px solid hsl(220 14% 22%)', color: 'hsl(0 0% 96%)' };

  return (
    <div className="min-h-screen pt-32 pb-16 px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="⭐" title="A* Algorithm" description="A* combines actual cost from start with a heuristic estimate to the goal, efficiently guiding the search toward the target." complexity={{ time: "O((V+E) log V)", space: "O(V)" }} />
      <div className="max-w-5xl mx-auto mb-8">
        <div className="card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 gradient-text-secondary">Graph + Heuristic Input</h3>
          {nodes.map((item, idx) => (
            <div key={idx} className="flex gap-3 mb-2 items-center">
              <input value={item.node} disabled={isPlaying} onChange={e => { const c = [...nodes]; c[idx].node = e.target.value; setNodes(c); }} placeholder="Node" className="px-3 py-2 rounded-xl w-20 outline-none" style={inputStyle} />
              <input value={item.neighbors} disabled={isPlaying} onChange={e => { const c = [...nodes]; c[idx].neighbors = e.target.value; setNodes(c); }} placeholder="B:4,C:2" className="px-3 py-2 rounded-xl flex-1 outline-none" style={inputStyle} />
              <input type="number" value={item.h} disabled={isPlaying} onChange={e => { const c = [...nodes]; c[idx].h = e.target.value; setNodes(c); }} placeholder="h" className="px-3 py-2 rounded-xl w-20 outline-none" style={inputStyle} />
              <button disabled={isPlaying} onClick={() => { const d = nodes[idx].node; let u = nodes.filter((_, i) => i !== idx); u = u.map(it => ({ ...it, neighbors: it.neighbors.split(",").filter(x => !x.startsWith(d + ":")).join(",") })); setNodes(u); }} className="px-3 py-2 rounded-xl" style={{ background: 'hsl(0 72% 58%)', color: 'hsl(0 0% 96%)' }}>✕</button>
            </div>
          ))}
          <button onClick={() => setNodes([...nodes, { node: "", neighbors: "", h: 0 }])} className="mt-3 px-4 py-2 rounded-xl btn-primary">+ Add Node</button>
          <div className="flex gap-3 mt-4">
            <div><label className="text-xs block mb-1" style={{ color: 'hsl(220 10% 50%)' }}>Start</label><input value={start} onChange={e => setStart(e.target.value)} className="px-3 py-2 rounded-xl w-24 outline-none" style={inputStyle} /></div>
            <div><label className="text-xs block mb-1" style={{ color: 'hsl(220 10% 50%)' }}>End</label><input value={end} onChange={e => setEnd(e.target.value)} className="px-3 py-2 rounded-xl w-24 outline-none" style={inputStyle} /></div>
          </div>
          {error && <p className="text-sm mt-2" style={{ color: 'hsl(0 72% 58%)' }}>{error}</p>}
        </div>
      </div>
      <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
      <AlgoVisualizationContainer>
        <div className="flex justify-center">
          <svg width="560" height="480" className="rounded-xl" style={{ background: 'hsl(220 20% 6%)' }}>
            {nodeKeys.map(u => Object.entries(adj[u]).map(([v, w], i) => positions[u] && positions[v] ? (<g key={`${u}-${v}-${i}`}><line x1={positions[u].x} y1={positions[u].y} x2={positions[v].x} y2={positions[v].y} stroke="hsl(220 14% 22%)" strokeWidth="1.5" /><text x={(positions[u].x + positions[v].x) / 2} y={(positions[u].y + positions[v].y) / 2} fill="hsl(220 10% 60%)" fontSize="12">{w}</text></g>) : null))}
            {nodeKeys.map(node => {
              let color = "hsl(220 60% 55%)";
              if (step.visited?.includes(node)) color = "hsl(145 65% 48%)";
              if (step.currentNode === node) color = "hsl(40 90% 55%)";
              if (step.found && node === end) color = "hsl(0 72% 58%)";
              return (<g key={node}><circle cx={positions[node].x} cy={positions[node].y} r="24" fill={color} style={{ filter: step.currentNode === node ? 'drop-shadow(0 0 8px hsl(40 90% 55%))' : 'none' }} /><text x={positions[node].x} y={positions[node].y + 5} textAnchor="middle" fill="hsl(220 20% 6%)" fontWeight="bold" fontSize="14">{node}</text></g>);
            })}
          </svg>
        </div>
      </AlgoVisualizationContainer>
    </div>
  );
};

export default AStarPage;

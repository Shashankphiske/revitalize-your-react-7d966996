import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const BFS_CODE = [
  "function bfs(graph, start, target) {",
  "  const queue = [start];",
  "  const visited = new Set([start]);",
  "  while (queue.length > 0) {",
  "    const node = queue.shift();",
  "    if (node === target) return node;",
  "    for (const neighbor of graph[node]) {",
  "      if (!visited.has(neighbor)) {",
  "        visited.add(neighbor);",
  "        queue.push(neighbor);",
  "      }",
  "    }",
  "  }",
  "  return null;",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (step.found) return 5;
  if (step.num !== undefined) return 4;
  return 13;
};

const BFSPage = () => {
  const [nodes, setNodes] = useState([
    { node: "0", neighbors: "1,2" },
    { node: "1", neighbors: "0,3,4" },
    { node: "2", neighbors: "0,5" },
    { node: "3", neighbors: "1" },
    { node: "4", neighbors: "1" },
    { node: "5", neighbors: "2" },
  ]);

  const [root, setRoot] = useState("0");
  const [target, setTarget] = useState("5");
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visited, setVisited] = useState(new Set());
  const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [explanation, setExplanation] = useState("");

  const timerRef = useRef(null);

  const buildAdjList = () => {
    const adj = {};
    for (let item of nodes) {
      const node = item.node.trim();
      if (!node) continue;
      adj[node] = item.neighbors.split(",").map((n) => n.trim()).filter(Boolean);
    }
    return adj;
  };

  const fetchBFSSteps = async (adjList, root, target) => {
    const res = await fetch("http://localhost:3000/graphalgo/breadthfirstsearch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adjList, root, num: target }),
    });
    const data = await res.json();
    return data.arr;
  };

  const handlePlay = async () => {
    if (isPlaying) return;
    try {
      const adjList = buildAdjList();
      if (!adjList[root]) { setError(`Root node "${root}" does not exist.`); return; }
      for (let u in adjList) {
        for (let v of adjList[u]) {
          if (!adjList[v]) { setError(`Neighbor "${v}" is not defined as a node.`); return; }
        }
      }
      setError("");
      setVisited(new Set());
      setCurrentStepIndex(0);
      setExplanation("Starting BFS traversal...");
      const bfsSteps = await fetchBFSSteps(adjList, root, target);
      setSteps(bfsSteps);
      setIsPlaying(true);
    } catch {
      setError("Invalid graph input.");
    }
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => {
    clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]);
    setVisited(new Set()); setCurrentStepIndex(0); setExplanation("");
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;
    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setVisited((prev) => new Set(prev).add(step.num));
      setHighlightedLine(getHighlightedLine(step));
      setExplanation(step.found ? `🎯 Target node ${target} found!` : `Visiting node ${step.num}`);
      setCurrentStepIndex((i) => i + 1);
    }, 1800);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const step = steps[currentStepIndex - 1] || {};
  const { num: currentNode, queue = [], found = false } = step;

  const adjList = buildAdjList();
  const nodeKeys = Object.keys(adjList);
  const radius = 160, cx = 260, cy = 220;
  const positions = {};
  nodeKeys.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodeKeys.length;
    positions[node] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  const inputStyle = {
    background: 'hsl(220 20% 6%)',
    border: '1px solid hsl(220 14% 22%)',
    color: 'hsl(0 0% 96%)',
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 px-3 sm:px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader
        icon="🌊"
        title="Breadth-First Search"
        description="BFS explores nodes level by level, starting from a given source node. It visits all immediate neighbors before moving deeper, using a queue to manage the traversal order."
        complexity={{ time: "O(V + E)", space: "O(V)" }}
      />

      {/* Graph Input */}
      <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
        <div className="card rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 gradient-text-secondary">Graph Input (Adjacency List)</h3>
          {nodes.map((item, idx) => (
            <div key={idx} className="flex gap-2 sm:gap-3 mb-2 items-center flex-wrap sm:flex-nowrap">
              <input value={item.node} disabled={isPlaying}
                onChange={(e) => { const copy = [...nodes]; copy[idx].node = e.target.value; setNodes(copy); }}
                placeholder="Node" className="px-3 py-2 rounded-xl w-16 sm:w-24 outline-none text-sm" style={inputStyle} />
              <input value={item.neighbors} disabled={isPlaying}
                onChange={(e) => { const copy = [...nodes]; copy[idx].neighbors = e.target.value; setNodes(copy); }}
                placeholder="Neighbors" className="px-3 py-2 rounded-xl flex-1 min-w-0 outline-none text-sm" style={inputStyle} />
              <button disabled={isPlaying}
                onClick={() => {
                  const nodeToDelete = nodes[idx].node;
                  let updated = nodes.filter((_, i) => i !== idx);
                  updated = updated.map((item) => ({ ...item, neighbors: item.neighbors.split(",").map((n) => n.trim()).filter((n) => n && n !== nodeToDelete).join(",") }));
                  setNodes(updated);
                }}
                className="px-3 py-2 rounded-xl font-semibold transition-all text-sm flex-shrink-0" style={{ background: 'hsl(0 72% 58%)', color: 'hsl(0 0% 96%)' }}>✕</button>
            </div>
          ))}
          <button onClick={() => setNodes([...nodes, { node: "", neighbors: "" }])}
            className="mt-3 px-4 py-2 rounded-xl font-semibold btn-primary text-sm">+ Add Node</button>

          <div className="flex gap-3 mt-4 flex-wrap">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'hsl(220 10% 50%)' }}>Root</label>
              <input value={root} onChange={(e) => setRoot(e.target.value)} placeholder="Root"
                className="px-3 py-2 rounded-xl w-20 sm:w-24 outline-none text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'hsl(220 10% 50%)' }}>Target</label>
              <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target"
                className="px-3 py-2 rounded-xl w-20 sm:w-24 outline-none text-sm" style={inputStyle} />
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
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 520 440" className="responsive-svg rounded-xl" style={{ background: 'hsl(220 20% 6%)', maxHeight: '440px' }}>
                {nodeKeys.map((u) =>
                  adjList[u].map((v, i) => positions[u] && positions[v] ? (
                    <line key={`${u}-${v}-${i}`} x1={positions[u].x} y1={positions[u].y} x2={positions[v].x} y2={positions[v].y} stroke="hsl(220 14% 22%)" strokeWidth="1.5" />
                  ) : null)
                )}
                {nodeKeys.map((node) => {
                  let color = "hsl(220 60% 55%)";
                  if (visited.has(node)) color = "hsl(145 65% 48%)";
                  if (node === currentNode) color = "hsl(40 90% 55%)";
                  if (found && node === target) color = "hsl(0 72% 58%)";
                  return (
                    <g key={node}>
                      <circle cx={positions[node].x} cy={positions[node].y} r="22" fill={color} style={{ filter: node === currentNode ? 'drop-shadow(0 0 8px hsl(40 90% 55%))' : 'none' }} />
                      <text x={positions[node].x} y={positions[node].y + 5} textAnchor="middle" fill="hsl(220 20% 6%)" fontWeight="bold" fontSize="14">{node}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="card rounded-xl p-3 sm:p-4 mt-4">
              <p className="text-sm"><strong style={{ color: 'hsl(220 10% 50%)' }}>Current Node:</strong> <span style={{ color: 'hsl(40 90% 55%)' }}>{currentNode || "-"}</span></p>
              <p className="text-sm"><strong style={{ color: 'hsl(220 10% 50%)' }}>Queue:</strong> <span style={{ color: 'hsl(168 80% 50%)' }}>{queue.length ? queue.join(" → ") : "Empty"}</span></p>
              {found && <p className="font-semibold mt-2 text-sm" style={{ color: 'hsl(145 65% 48%)' }}>🎯 Target node found!</p>}
            </div>
          </AlgoVisualizationContainer>
        </div>
        <div className="algo-code-panel">
          <CodeViewer code={BFS_CODE} highlightedLine={highlightedLine} title="bfs.js" />
        </div>
      </div>
    </div>
  );
};

export default BFSPage;

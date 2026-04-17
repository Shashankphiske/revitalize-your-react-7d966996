import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

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
      adj[node] = item.neighbors
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
    }
    return adj;
  };

  const fetchBFSSteps = async (adjList, root, target) => {
    const res = await fetch(
      "http://localhost/graphalgo/breadthfirstsearch",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adjList, root, num: target }),
      }
    );
    const data = await res.json();
    return data.arr;
  };

  const handlePlay = async () => {
    if (isPlaying) return;
    try {
      const adjList = buildAdjList();

      if (!adjList[root]) {
        setError(`Root node "${root}" does not exist.`);
        return;
      }

      for (let u in adjList) {
        for (let v of adjList[u]) {
          if (!adjList[v]) {
            setError(`Neighbor "${v}" is not defined as a node.`);
            return;
          }
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

  const handlePause = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
  };

  const handleReplay = () => {
    clearTimeout(timerRef.current);
    setIsPlaying(false);
    setSteps([]);
    setVisited(new Set());
    setCurrentStepIndex(0);
    setExplanation("");
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;

    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];

      setVisited((prev) => new Set(prev).add(step.num));
      setHighlightedLine(getHighlightedLine(step));

      setExplanation(
        step.found
          ? `🎯 Target node ${target} found!`
          : `Visiting node ${step.num}`
      );

      setCurrentStepIndex((i) => i + 1);
    }, 1500);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const step = steps[currentStepIndex - 1] || {};
  const { num: currentNode, queue = [], found = false } = step;

  const adjList = buildAdjList();
  const nodeKeys = Object.keys(adjList);

  const radius = 160,
    cx = 260,
    cy = 220;
  const positions = {};

  nodeKeys.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodeKeys.length;
    positions[node] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const inputStyle = {
    background: "hsl(220 20% 6%)",
    border: "1px solid hsl(220 14% 22%)",
    color: "hsl(0 0% 96%)",
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 px-4 sm:px-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <AlgoPageHeader
          icon="🌊"
          title="Breadth-First Search"
          description="BFS explores nodes level by level using a queue."
          complexity={{ time: "O(V + E)", space: "O(V)" }}
        />

        {/* GRAPH INPUT */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Graph Input</h3>

          {nodes.map((item, idx) => (
            <div key={idx} className="flex gap-3 flex-wrap sm:flex-nowrap">
              <input
                value={item.node}
                disabled={isPlaying}
                onChange={(e) => {
                  const copy = [...nodes];
                  copy[idx].node = e.target.value;
                  setNodes(copy);
                }}
                placeholder="Node"
                className="px-3 py-2 rounded-xl w-20 text-sm"
                style={inputStyle}
              />

              <input
                value={item.neighbors}
                disabled={isPlaying}
                onChange={(e) => {
                  const copy = [...nodes];
                  copy[idx].neighbors = e.target.value;
                  setNodes(copy);
                }}
                placeholder="Neighbors"
                className="px-3 py-2 rounded-xl flex-1 text-sm"
                style={inputStyle}
              />
            </div>
          ))}

          <button
            onClick={() =>
              setNodes([...nodes, { node: "", neighbors: "" }])
            }
            className="btn-primary px-4 py-2 rounded-xl"
          >
            + Add Node
          </button>

          <div className="flex gap-4">
            <input value={root} onChange={(e) => setRoot(e.target.value)} placeholder="Root" className="px-3 py-2 rounded-xl w-24" style={inputStyle} />
            <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target" className="px-3 py-2 rounded-xl w-24" style={inputStyle} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* CONTROLS + EXPLANATION */}
        <div className="card p-5 space-y-4">
          <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
          <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
        </div>

        {/* MAIN SPLIT */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* VISUALIZER */}
          <div className="card p-4 flex flex-col">
            <AlgoVisualizationContainer>
              <div className="flex flex-col items-center justify-center min-h-[420px]">
                <svg viewBox="0 0 520 440" className="w-full max-w-xl">

                  {nodeKeys.map((u) =>
                    adjList[u].map((v, i) => (
                      <line
                        key={`${u}-${v}-${i}`}
                        x1={positions[u].x}
                        y1={positions[u].y}
                        x2={positions[v].x}
                        y2={positions[v].y}
                        stroke="#333"
                      />
                    ))
                  )}

                  {nodeKeys.map((node) => {
                    let color = "#3b82f6";
                    if (visited.has(node)) color = "#22c55e";
                    if (node === currentNode) color = "#f59e0b";
                    if (found && node === target) color = "#ef4444";

                    return (
                      <g key={node}>
                        <circle cx={positions[node].x} cy={positions[node].y} r="22" fill={color} />
                        <text x={positions[node].x} y={positions[node].y + 5} textAnchor="middle" fill="#000">
                          {node}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </AlgoVisualizationContainer>
          </div>

          {/* CODE */}
          <div className="card p-4 flex flex-col">
            <CodeViewer code={BFS_CODE} highlightedLine={highlightedLine} title="bfs.js" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default BFSPage;
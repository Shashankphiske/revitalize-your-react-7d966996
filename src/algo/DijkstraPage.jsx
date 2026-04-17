import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const getHighlightedLine = (step) => {
  if (!step) return null;

  switch (step.action) {
    case "init":
      return 2;
    case "select":
      return 6;
    case "check":
      return 14;
    case "relax":
      return 16;
    case "found":
      return 11;
    default:
      return null;
  }
};

const DIJKSTRA_CODE = [
  "function dijkstra(adj, start, end) {",
  "  const distances = {}, visited = new Set();",
  "  const pq = [{ node: start, distance: 0 }];",
  "",
  "  while (pq.length > 0) {",
  "    pq.sort((a, b) => a.distance - b.distance);",
  "    const current = pq.shift().node;",
  "",
  "    if (visited.has(current)) continue;",
  "    visited.add(current);",
  "",
  "    if (current === end) return FOUND;",
  "",
  "    for (neighbor of adj[current]) {",
  "      const newDist = distances[current] + weight;",
  "      if (newDist < distances[neighbor]) {",
  "        distances[neighbor] = newDist;",
  "        pq.push(neighbor);",
  "      }",
  "    }",
  "  }",
  "}",
];

const DijkstraPage = () => {
  const [nodes, setNodes] = useState([
    { node: "A", neighbors: "B:4,C:2" },
    { node: "B", neighbors: "A:4,C:1,D:5" },
    { node: "C", neighbors: "A:2,B:1,D:8" },
    { node: "D", neighbors: "B:5,C:8" },
  ]);

  const [start, setStart] = useState("A");
  const [end, setEnd] = useState("D");

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);

  const buildAdjList = () => {
    const adj = {};
    for (let item of nodes) {
      const u = item.node.trim();
      if (!u) continue;

      adj[u] = {};

      item.neighbors
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((pair) => {
          const [v, w] = pair.split(":");
          if (v && !isNaN(Number(w))) {
            adj[u][v.trim()] = Number(w);
          }
        });
    }

    return adj;
  };

  const fetchSteps = async (adj, start, end) => {
    const res = await fetch(
      "http://localhost:3000/shortestpathrouter/dijkstrasalgo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adj, start, end }),
      }
    );
    return (await res.json()).arr;
  };

  const handlePlay = async () => {
    if (isPlaying) return;

    const adj = buildAdjList();

    if (!adj[start] || !adj[end]) {
      setError("Start or end node missing.");
      return;
    }

    setError("");
    setSteps([]);
    setCurrentStepIndex(0);
    setExplanation("Starting Dijkstra's...");

    const resSteps = await fetchSteps(adj, start, end);
    setSteps(resSteps);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
  };

  const handleReplay = () => {
    clearTimeout(timerRef.current);
    setIsPlaying(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setExplanation("");
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;

    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];

      setExplanation(step.reason);
      setHighlightedLine(getHighlightedLine(step));
      setCurrentStepIndex((i) => i + 1);
    }, 1500);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const step = steps[currentStepIndex - 1] || {};
  const adj = buildAdjList();
  const nodeKeys = Object.keys(adj);

  const radius = 170,
    cx = 280,
    cy = 240;
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
    <div className="min-h-screen pt-32 pb-16 px-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        <AlgoPageHeader
          icon="🛤️"
          title="Dijkstra's Algorithm"
          description="Find the shortest path from a source node to a target node in a weighted graph."
          complexity={{ time: "O((V+E) log V)", space: "O(V)" }}
        />

        {/* INPUT */}
        <div className="card p-5 space-y-4">
          <h3 className="text-lg font-semibold">Graph Input</h3>

          {nodes.map((item, idx) => (
            <div key={idx} className="flex gap-3 flex-wrap sm:flex-nowrap">
              <input
                value={item.node}
                disabled={isPlaying}
                onChange={(e) => {
                  const c = [...nodes];
                  c[idx].node = e.target.value;
                  setNodes(c);
                }}
                className="px-3 py-2 rounded-xl w-20 text-sm"
                style={inputStyle}
              />

              <input
                value={item.neighbors}
                disabled={isPlaying}
                onChange={(e) => {
                  const c = [...nodes];
                  c[idx].neighbors = e.target.value;
                  setNodes(c);
                }}
                className="px-3 py-2 rounded-xl flex-1 text-sm"
                style={inputStyle}
              />
            </div>
          ))}

          <button
            onClick={() => setNodes([...nodes, { node: "", neighbors: "" }])}
            className="btn-primary px-4 py-2 rounded-xl"
          >
            + Add Node
          </button>

          <div className="flex gap-4">
            <input
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="px-3 py-2 rounded-xl w-24"
              style={inputStyle}
            />
            <input
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="px-3 py-2 rounded-xl w-24"
              style={inputStyle}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* CONTROLS */}
        <div className="card p-5 space-y-4">
          <ControlButtons
            onPlay={handlePlay}
            onPause={handlePause}
            onReplay={handleReplay}
            disabled={isPlaying}
          />
          <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
        </div>

        {/* SPLIT LAYOUT */}
        <div className="algo-split-layout">

          {/* VISUALIZATION */}
          <div className="algo-visualization-panel">
            <AlgoVisualizationContainer>
              <svg viewBox="0 0 560 480" className="w-full max-w-xl">

                {nodeKeys.map((u) =>
                  Object.entries(adj[u]).map(([v, w], i) => (
                    <g key={`${u}-${v}-${i}`}>
                      <line
                        x1={positions[u].x}
                        y1={positions[u].y}
                        x2={positions[v].x}
                        y2={positions[v].y}
                        stroke="#333"
                      />
                      <text
                        x={(positions[u].x + positions[v].x) / 2}
                        y={(positions[u].y + positions[v].y) / 2}
                        fill="#aaa"
                        fontSize="12"
                      >
                        {w}
                      </text>
                    </g>
                  ))
                )}

                {nodeKeys.map((node) => {
                  let color = "#3b82f6";
                  if (step.visited?.includes(node)) color = "#22c55e";
                  if (step.currentNode === node) color = "#f59e0b";
                  if (step.found && node === end) color = "#ef4444";

                  return (
                    <g key={node}>
                      <circle
                        cx={positions[node].x}
                        cy={positions[node].y}
                        r="24"
                        fill={color}
                      />
                      <text
                        x={positions[node].x}
                        y={positions[node].y + 5}
                        textAnchor="middle"
                        fill="#000"
                      >
                        {node}
                      </text>
                    </g>
                  );
                })}

              </svg>
            </AlgoVisualizationContainer>
          </div>

          {/* CODE PANEL */}
          <div className="code">
            <CodeViewer
              code={DIJKSTRA_CODE}
              highlightedLine={highlightedLine}
              title="dijkstra-algorithm.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default DijkstraPage;
import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const CODE = [
  "function preorder(root) {",
  "  if (root === null) return;",
  "  // Step 1: Visit current node",
  "  visit(root);",
  "  // Step 2: Traverse left subtree",
  "  preorder(root.left);",
  "  // Step 3: Traverse right subtree",
  "  preorder(root.right);",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  // Highlight the visit(root) line at line 3 when touching a node
  return 3;
};

const PreorderPage = () => {
  const [nodes, setNodes] = useState([
    { node: "1", left: "2", right: "3" },
    { node: "2", left: "4", right: "5" },
    { node: "3", left: "", right: "" },
    { node: "4", left: "", right: "" },
    { node: "5", left: "", right: "" },
  ]);

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);
  const highlightTimerRef = useRef(null);

  const buildAdjList = () => {
    const adj = {};
    for (let n of nodes) {
      if (!n.node) continue;
      adj[n.node] = [n.left || null, n.right || null];
    }
    return adj;
  };

  const findRoot = (adj) => {
    const children = new Set();
    for (let k in adj) {
      const [l, r] = adj[k];
      if (l) children.add(l);
      if (r) children.add(r);
    }
    return Object.keys(adj).find((k) => !children.has(k));
  };

  const fetchSteps = async (adj) => {
    const res = await fetch(
      "http://localhost:3000/treealgo/preorder",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adj }),
      }
    );
    return (await res.json()).arr;
  };

  const handlePlay = async () => {
    if (isPlaying) return;

    try {
      const adj = buildAdjList();

      if (!Object.keys(adj).length) {
        setError("Tree empty");
        return;
      }

      setError("");
      setCurrentStepIndex(0);
      setExplanation("Starting Preorder Traversal (Root → Left → Right)");

      const data = await fetchSteps(adj);
      setSteps(data);

      setIsPlaying(true);
    } catch {
      setError("Invalid tree input");
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
  };

  const handleReplay = () => {
    clearTimeout(timerRef.current);
    clearTimeout(highlightTimerRef.current);
    setIsPlaying(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setExplanation("");
    setError("");
    setHighlightedLine(null);
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;

    // Early highlighting phase (200ms)
    highlightTimerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];
      setHighlightedLine(getHighlightedLine(step));
    }, 200);

    // Full state update phase (1800ms)
    timerRef.current = setTimeout(() => {
      const node = steps[currentStepIndex];

      setExplanation(`Visiting node ${node}`);
      setCurrentStepIndex((i) => i + 1);
    }, 1800);

    return () => {
      clearTimeout(highlightTimerRef.current);
      clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps]);

  const adj = buildAdjList();
  const root = findRoot(adj);

  const positions = {};
  const edges = [];

  const visited = new Set(steps.slice(0, currentStepIndex));
  const currentNode = steps[currentStepIndex - 1];

  const buildPos = (node, x, y, gap) => {
    if (!node || positions[node]) return;

    positions[node] = { x, y };

    const [l, r] = adj[node] || [];

    if (l) {
      edges.push([node, l]);
      buildPos(l, x - gap, y + 80, gap / 2);
    }

    if (r) {
      edges.push([node, r]);
      buildPos(r, x + gap, y + 80, gap / 2);
    }
  };

  if (root) buildPos(root, 400, 80, 160);

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
          icon="🌲"
          title="Preorder Traversal"
          description="Visits nodes in Root → Left → Right order. Used for copying trees and prefix expressions."
          complexity={{ time: "O(n)", space: "O(h)" }}
        />

        {/* INPUT CARD */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Tree Input</h3>

          {nodes.map((n, idx) => (
            <div
              key={idx}
              className="flex gap-3 flex-wrap sm:flex-nowrap"
            >
              <input
                value={n.node}
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
                value={n.left}
                disabled={isPlaying}
                onChange={(e) => {
                  const copy = [...nodes];
                  copy[idx].left = e.target.value;
                  setNodes(copy);
                }}
                placeholder="Left"
                className="px-3 py-2 rounded-xl w-20 text-sm"
                style={inputStyle}
              />

              <input
                value={n.right}
                disabled={isPlaying}
                onChange={(e) => {
                  const copy = [...nodes];
                  copy[idx].right = e.target.value;
                  setNodes(copy);
                }}
                placeholder="Right"
                className="px-3 py-2 rounded-xl w-20 text-sm"
                style={inputStyle}
              />
            </div>
          ))}

          <button
            onClick={() =>
              setNodes([...nodes, { node: "", left: "", right: "" }])
            }
            className="btn-primary px-4 py-2 rounded-xl"
          >
            + Add Node
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* CONTROLS + EXPLANATION */}
        <div className="card p-5 space-y-4">
          <ControlButtons
            onPlay={handlePlay}
            onPause={handlePause}
            onReplay={handleReplay}
            disabled={isPlaying}
          />

          <AlgoExplanation
            explanation={explanation}
            isPlaying={isPlaying}
          />
        </div>

        {/* MAIN SPLIT */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* VISUALIZATION */}
          <div className="card p-4 flex flex-col">
            <AlgoVisualizationContainer>
              <div className="flex justify-center overflow-x-auto min-h-[420px]">
                <svg
                  viewBox="0 0 800 400"
                  className="w-full max-w-2xl"
                >
                  {edges.map(([u, v], i) => (
                    <line
                      key={i}
                      x1={positions[u].x}
                      y1={positions[u].y}
                      x2={positions[v].x}
                      y2={positions[v].y}
                      stroke="#333"
                    />
                  ))}

                  {Object.entries(positions).map(
                    ([node, pos]) => {
                      let color =
                        "hsl(220 60% 55%)";

                      if (visited.has(node))
                        color =
                          "hsl(145 65% 48%)";

                      if (node === currentNode)
                        color =
                          "hsl(40 90% 55%)";

                      return (
                        <g key={node}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="22"
                            fill={color}
                          />
                          <text
                            x={pos.x}
                            y={pos.y + 5}
                            textAnchor="middle"
                            fill="#000"
                            fontWeight="bold"
                          >
                            {node}
                          </text>
                        </g>
                      );
                    }
                  )}
                </svg>
              </div>
            </AlgoVisualizationContainer>
          </div>

          {/* CODE */}
          <div className="card p-4 flex flex-col">
            <CodeViewer
              code={CODE}
              highlightedLine={highlightedLine}
              title="preorder.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreorderPage;
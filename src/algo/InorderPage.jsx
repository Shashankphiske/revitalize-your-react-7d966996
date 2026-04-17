import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const CODE = [
  "function inorder(root) {",
  "  if (root === null) return;",
  "  // Step 1: Traverse left subtree",
  "  inorder(root.left);",
  "  // Step 2: Visit current node",
  "  visit(root);",
  "  // Step 3: Traverse right subtree",
  "  inorder(root.right);",
  "}",
];

const getHighlightedLineByTraversal = (traversalType) => {
  // Returns the line number for the visit(root) line in each traversal
  // With the expanded CODE, the visit line is at index 5 for all traversals
  // (inorder, preorder, postorder all have same structure now)
  return 5;
};

const TreeTraversalPage = ({
  title,
  icon,
  description,
  fetchEndpoint,
  traversalOrder,
}) => {
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
    for (let key in adj) {
      const [l, r] = adj[key];
      if (l) children.add(l);
      if (r) children.add(r);
    }
    return Object.keys(adj).find((k) => !children.has(k));
  };

  const fetchSteps = async (adj) => {
    const res = await fetch(
      `http://localhost:3000/treealgo/${fetchEndpoint}`,
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
      if (Object.keys(adj).length === 0) {
        setError("Tree cannot be empty");
        return;
      }

      setError("");
      setCurrentStepIndex(0);
      setExplanation(`Starting ${title} (${traversalOrder})`);

      setSteps(await fetchSteps(adj));
      setIsPlaying(true);
    } catch {
      setError("Invalid tree structure");
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
    setHighlightedLine(null);
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) {
      if (currentStepIndex >= steps.length && steps.length > 0) {
        setExplanation(`Complete: [${steps.join(", ")}]`);
      }
      return;
    }

    // Early highlighting phase (200ms)
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedLine(getHighlightedLineByTraversal(fetchEndpoint));
    }, 200);

    // Full state update phase (1800ms)
    timerRef.current = setTimeout(() => {
      setExplanation(`Visiting node ${steps[currentStepIndex]}`);
      setCurrentStepIndex((prev) => prev + 1);
    }, 1800);

    return () => {
      clearTimeout(highlightTimerRef.current);
      clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps, fetchEndpoint]);

  const adj = buildAdjList();
  const root = findRoot(adj);

  const positions = {};
  const edges = [];

  const buildPositions = (node, x, y, gap) => {
    if (!node || positions[node]) return;

    positions[node] = { x, y };
    const [left, right] = adj[node] || [];

    if (left) {
      edges.push([node, left]);
      buildPositions(left, x - gap, y + 80, gap / 2);
    }

    if (right) {
      edges.push([node, right]);
      buildPositions(right, x + gap, y + 80, gap / 2);
    }
  };

  if (root) buildPositions(root, 400, 60, 160);

  const visitedSet = new Set(steps.slice(0, currentStepIndex));
  const currentNode = steps[currentStepIndex - 1];

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
          icon={icon}
          title={title}
          description={description}
          complexity={{ time: "O(n)", space: "O(h)" }}
        />

        {/* INPUT CARD */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Tree Input</h3>

          {nodes.map((n, idx) => (
            <div key={idx} className="flex gap-3 flex-wrap sm:flex-nowrap">
              <input
                value={n.node}
                disabled={isPlaying}
                onChange={(e) => {
                  const c = [...nodes];
                  c[idx].node = e.target.value;
                  setNodes(c);
                }}
                placeholder="Node"
                className="px-3 py-2 rounded-xl w-20 text-sm"
                style={inputStyle}
              />

              <input
                value={n.left}
                disabled={isPlaying}
                onChange={(e) => {
                  const c = [...nodes];
                  c[idx].left = e.target.value;
                  setNodes(c);
                }}
                placeholder="Left"
                className="px-3 py-2 rounded-xl w-20 text-sm"
                style={inputStyle}
              />

              <input
                value={n.right}
                disabled={isPlaying}
                onChange={(e) => {
                  const c = [...nodes];
                  c[idx].right = e.target.value;
                  setNodes(c);
                }}
                placeholder="Right"
                className="px-3 py-2 rounded-xl w-20 text-sm"
                style={inputStyle}
              />
            </div>
          ))}

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

          <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
        </div>

        {/* SPLIT LAYOUT */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* VISUALIZATION */}
          <div className="card p-4">
            <AlgoVisualizationContainer>
              <div className="flex justify-center overflow-x-auto">
                <svg viewBox="0 0 800 400" className="w-full max-w-xl">

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

                  {Object.entries(positions).map(([node, pos]) => {
                    let color = "#3b82f6";
                    if (visitedSet.has(node)) color = "#22c55e";
                    if (node === currentNode) color = "#f59e0b";

                    return (
                      <g key={node}>
                        <circle cx={pos.x} cy={pos.y} r="22" fill={color} />
                        <text
                          x={pos.x}
                          y={pos.y + 5}
                          textAnchor="middle"
                          fill="#000"
                        >
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
          <div className="card p-4">
            <CodeViewer
              code={CODE}
              highlightedLine={highlightedLine}
              title={`${fetchEndpoint}.js`}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

const InorderPage = () => (
  <TreeTraversalPage
    title="Inorder Traversal"
    icon="🌿"
    description="Inorder visits nodes in Left → Root → Right order. In BSTs, this produces sorted output."
    fetchEndpoint="inorder"
    traversalOrder="Left → Root → Right"
  />
);

export default InorderPage;
import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const CODE = ["function inorder(node) {", "  if (node === null) return;", "  inorder(node.left);", "  visit(node);", "  inorder(node.right);", "}"];

const TreeTraversalPage = ({ title, icon, description, fetchEndpoint, traversalOrder }) => {
  const [nodes, setNodes] = useState([
    { node: "1", left: "2", right: "3" }, { node: "2", left: "4", right: "5" },
    { node: "3", left: "", right: "" }, { node: "4", left: "", right: "" }, { node: "5", left: "", right: "" },
  ]);
  const [steps, setSteps] = useState([]); const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  const buildAdjList = () => { const adj = {}; for (let n of nodes) { if (!n.node) continue; adj[n.node] = [n.left || null, n.right || null]; } return adj; };
  const findRoot = (adj) => { const children = new Set(); for (let key in adj) { const [l, r] = adj[key]; if (l) children.add(l); if (r) children.add(r); } return Object.keys(adj).find((k) => !children.has(k)); };

  const fetchSteps = async (adj) => { const res = await fetch(`http://localhost:3000/treealgo/${fetchEndpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adj }) }); return (await res.json()).arr; };

  const handlePlay = async () => {
    if (isPlaying) return;
    try {
      const adj = buildAdjList();
      if (Object.keys(adj).length === 0) { setError("Tree cannot be empty"); return; }
      setError(""); setCurrentStepIndex(0); setExplanation(`Starting ${title} (${traversalOrder})`);
      setSteps(await fetchSteps(adj)); setIsPlaying(true);
    } catch { setError("Invalid tree structure"); }
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setCurrentStepIndex(0); setExplanation(""); };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) {
      if (currentStepIndex >= steps.length && steps.length > 0) setExplanation(`Complete: [${steps.join(", ")}]`);
      return;
    }
    timerRef.current = setTimeout(() => { setExplanation(`Visiting node ${steps[currentStepIndex]}`); setCurrentStepIndex((prev) => prev + 1); }, 1200);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const adj = buildAdjList(); const root = findRoot(adj);
  const positions = {}; const edges = [];
  const buildPositions = (node, x, y, gap) => { if (!node || positions[node]) return; positions[node] = { x, y }; const [left, right] = adj[node] || []; if (left) { edges.push([node, left]); buildPositions(left, x - gap, y + 80, gap / 2); } if (right) { edges.push([node, right]); buildPositions(right, x + gap, y + 80, gap / 2); } };
  if (root) buildPositions(root, 400, 60, 160);
  const visitedSet = new Set(steps.slice(0, currentStepIndex));
  const currentNode = steps[currentStepIndex - 1];
  const inputStyle = { background: 'hsl(220 20% 6%)', border: '1px solid hsl(220 14% 22%)', color: 'hsl(0 0% 96%)' };

  return (
    <div className="min-h-screen pt-32 pb-16 px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon={icon} title={title} description={description} complexity={{ time: "O(n)", space: "O(h)" }} />
      <div className="max-w-5xl mx-auto mb-8">
        <div className="card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 gradient-text-secondary">Tree Input</h3>
          {nodes.map((n, idx) => (
            <div key={idx} className="flex gap-3 mb-2 items-center">
              <input value={n.node} disabled={isPlaying} onChange={(e) => { const c = [...nodes]; c[idx].node = e.target.value; setNodes(c); }} placeholder="Node" className="px-3 py-2 rounded-xl w-20 outline-none" style={inputStyle} />
              <input value={n.left} disabled={isPlaying} onChange={(e) => { const c = [...nodes]; c[idx].left = e.target.value; setNodes(c); }} placeholder="Left" className="px-3 py-2 rounded-xl w-20 outline-none" style={inputStyle} />
              <input value={n.right} disabled={isPlaying} onChange={(e) => { const c = [...nodes]; c[idx].right = e.target.value; setNodes(c); }} placeholder="Right" className="px-3 py-2 rounded-xl w-20 outline-none" style={inputStyle} />
              <button disabled={isPlaying} onClick={() => { const del = nodes[idx].node; let upd = nodes.filter((_, i) => i !== idx); upd = upd.map((x) => ({ ...x, left: x.left === del ? "" : x.left, right: x.right === del ? "" : x.right })); setNodes(upd); }} className="px-3 py-2 rounded-xl font-semibold" style={{ background: 'hsl(0 72% 58%)', color: 'hsl(0 0% 96%)' }}>✕</button>
            </div>
          ))}
          <button onClick={() => setNodes([...nodes, { node: "", left: "", right: "" }])} className="mt-3 px-4 py-2 rounded-xl font-semibold btn-primary">+ Add Node</button>
          {error && <p className="text-sm mt-3" style={{ color: 'hsl(0 72% 58%)' }}>{error}</p>}
        </div>
      </div>
      <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
      <div className="algo-split-layout">
        <div className="algo-visualization-panel">
          <AlgoVisualizationContainer>
            <div className="flex justify-center">
              <svg width="800" height="400" className="rounded-xl" style={{ background: 'hsl(220 20% 6%)' }}>
                {edges.map(([u, v], i) => (<line key={i} x1={positions[u].x} y1={positions[u].y} x2={positions[v].x} y2={positions[v].y} stroke="hsl(220 14% 22%)" strokeWidth="1.5" />))}
                {Object.entries(positions).map(([node, pos]) => {
                  let color = "hsl(220 60% 55%)";
                  if (visitedSet.has(node)) color = "hsl(145 65% 48%)";
                  if (node === currentNode) color = "hsl(40 90% 55%)";
                  return (<g key={node}><circle cx={pos.x} cy={pos.y} r="22" fill={color} style={{ filter: node === currentNode ? 'drop-shadow(0 0 8px hsl(40 90% 55%))' : 'none' }} /><text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="hsl(220 20% 6%)" fontWeight="bold" fontSize="14">{node}</text></g>);
                })}
              </svg>
            </div>
          </AlgoVisualizationContainer>
        </div>
        <div className="algo-code-panel"><CodeViewer code={CODE} highlightedLine={null} title={`${fetchEndpoint}.js`} /></div>
      </div>
    </div>
  );
};

const InorderPage = () => <TreeTraversalPage title="Inorder Traversal" icon="🌿" description="Inorder visits nodes in Left → Root → Right order. In BSTs, this produces sorted output." fetchEndpoint="inorder" traversalOrder="Left → Root → Right" />;
export default InorderPage;

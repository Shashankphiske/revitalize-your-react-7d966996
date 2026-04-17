import { Link } from "react-router-dom";
import LeetCodeQuestionsPanel from "../components/LeetCodeQuestionsPanel";

const GraphAlgo = () => {
  const algorithms = [
    { to: "/bfs", title: "Breadth-First Search", abbr: "BFS", desc: "Level-by-level graph traversal using a queue data structure.", icon: "🌊" },
    { to: "/dfs", title: "Depth-First Search", abbr: "DFS", desc: "Deep exploration graph traversal using a stack data structure.", icon: "🏔️" }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6" style={{ color: 'hsl(var(--text-primary))' }}>
      <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
        <div className="inline-block mb-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center glow" style={{ background: 'hsl(var(--accent))' }}>
            <span className="text-2xl">🕸️</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">Graph Algorithms</span>
        </h1>
        <p className="text-base sm:text-lg mb-2" style={{ color: 'hsl(var(--text-secondary))' }}>
          Master graph traversal techniques and explore complex networks
        </p>
        <p className="text-sm" style={{ color: 'hsl(var(--text-muted))' }}>
          Learn how to navigate nodes and edges effectively
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {algorithms.map((algo, index) => (
          <Link key={index} to={algo.to} className="category-card p-6 sm:p-8 group">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{algo.icon}</div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:gradient-text transition-all" style={{ color: 'hsl(var(--text-primary))' }}>{algo.title}</h2>
            <div className="inline-block px-3 py-1 rounded-full glass text-xs font-semibold mb-3" style={{ color: 'hsl(var(--accent))' }}>{algo.abbr}</div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'hsl(var(--text-muted))' }}>{algo.desc}</p>
            <span className="gradient-text font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
              Visualize →
            </span>
          </Link>
        ))}
      </div>

      <LeetCodeQuestionsPanel topic="graph" title="Graph · LeetCode Practice" />
    </div>
  );
};

export default GraphAlgo;

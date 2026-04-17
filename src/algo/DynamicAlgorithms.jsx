import { Link } from "react-router-dom";
import LeetCodeQuestionsPanel from "../components/LeetCodeQuestionsPanel";

const DynamicAlgorithms = () => {
  const algorithms = [
    { to: "/dp/fibonacci", title: "Fibonacci DP", description: "Top-down and bottom-up Fibonacci visualization.", icon: "🔢" },
    { to: "/dp/coinchange", title: "Coin Change DP", description: "Find the minimum number of coins required to make a target amount.", icon: "🪙" }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6" style={{ color: 'hsl(var(--text-primary))' }}>
      <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
        <div className="inline-block mb-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center glow" style={{ background: 'hsl(var(--accent))' }}>
            <span className="text-2xl">🧩</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">Dynamic Programming</span>
        </h1>
        <p className="text-base sm:text-lg mb-2" style={{ color: 'hsl(var(--text-secondary))' }}>
          Solve complex problems by breaking them into overlapping subproblems
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {algorithms.map((algo, idx) => (
          <Link key={idx} to={algo.to} className="category-card p-6 sm:p-8 group">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{algo.icon}</div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:gradient-text transition-all" style={{ color: 'hsl(var(--text-primary))' }}>
              {algo.title}
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'hsl(var(--text-muted))' }}>
              {algo.description}
            </p>
            <span className="gradient-text font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
              Visualize →
            </span>
          </Link>
        ))}
      </div>

      <LeetCodeQuestionsPanel topic="dp" title="Dynamic Programming · LeetCode Practice" />
    </div>
  );
};

export default DynamicAlgorithms;

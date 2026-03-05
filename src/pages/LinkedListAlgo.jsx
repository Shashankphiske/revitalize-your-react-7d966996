import { Link } from "react-router-dom";

const LinkedListAlgo = () => {
  const algorithms = [
    { to: "/singly-insertion", title: "Singly - Insertion", desc: "Insert nodes in a singly linked list at any position.", icon: "➕", type: "Singly" },
    { to: "/singly-deletion", title: "Singly - Deletion", desc: "Delete nodes from a singly linked list at any position.", icon: "➖", type: "Singly" },
    { to: "/singly-reversal", title: "Singly - Reversal", desc: "Reverse a singly linked list by changing pointers.", icon: "🔄", type: "Singly" },
    { to: "/doubly-insertion", title: "Doubly - Insertion", desc: "Insert nodes in a doubly linked list with prev pointers.", icon: "➕", type: "Doubly" },
    { to: "/doubly-deletion", title: "Doubly - Deletion", desc: "Delete nodes from a doubly linked list.", icon: "➖", type: "Doubly" },
    { to: "/doubly-reversal", title: "Doubly - Reversal", desc: "Reverse a doubly linked list by swapping pointers.", icon: "🔄", type: "Doubly" }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6" style={{ color: 'hsl(var(--text-primary))' }}>
      <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
        <div className="inline-block mb-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center glow" style={{ background: 'hsl(var(--accent))' }}>
            <span className="text-2xl">🔗</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">Linked List Operations</span>
        </h1>
        <p className="text-base sm:text-lg mb-2" style={{ color: 'hsl(var(--text-secondary))' }}>
          Learn operations on singly and doubly linked lists
        </p>
        <p className="text-sm" style={{ color: 'hsl(var(--text-muted))' }}>
          Master insertion, deletion, and reversal techniques
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {algorithms.map((algo, index) => (
          <Link key={index} to={algo.to} className="category-card p-5 sm:p-6 group">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl sm:text-3xl">{algo.icon}</span>
              <span className="px-2 py-1 rounded-full glass text-xs font-semibold" style={{ color: algo.type === 'Singly' ? 'hsl(var(--accent))' : 'hsl(var(--accent-secondary))' }}>
                {algo.type}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 group-hover:gradient-text transition-all" style={{ color: 'hsl(var(--text-primary))' }}>{algo.title}</h2>
            <p className="text-sm mb-3 sm:mb-4 leading-relaxed" style={{ color: 'hsl(var(--text-muted))' }}>{algo.desc}</p>
            <span className="gradient-text font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
              Visualize →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LinkedListAlgo;

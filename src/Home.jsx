import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Home = () => {
  const categories = [
    { to: "/sortingalgorithms", icon: "🔢", title: "Sorting", description: "Bubble, Selection, Insertion, Merge, Quick, Heap Sort" },
    { to: "/searchingalgorithms", icon: "🔍", title: "Searching", description: "Binary Search and Linear Search techniques" },
    { to: "/graphalgorithms", icon: "🕸️", title: "Graphs", description: "BFS and DFS graph traversal methods" },
    { to: "/treealgorithms", icon: "🌳", title: "Trees", description: "Inorder, Preorder, and Postorder traversals" },
    { to: "/stackalgorithms", icon: "📚", title: "Stacks", description: "Push and Pop on LIFO data structure" },
    { to: "/queuealgorithms", icon: "🎫", title: "Queues", description: "Enqueue and Dequeue on FIFO structure" },
    { to: "/linkedlistalgorithms", icon: "🔗", title: "Linked Lists", description: "Insertion, Deletion, and Reversal" },
    { to: "/shortestpathalgorithms", icon: "🗺️", title: "Shortest Path", description: "Dijkstra's and A* algorithms" },
    { to: "/dynamicalgorithms", icon: "🧩", title: "Dynamic Programming", description: "Fibonacci, Coin Change, and more" },
  ];

  const stats = [
    { value: "25+", label: "Algorithms" },
    { value: "9", label: "Categories" },
    { value: "100%", label: "Interactive" },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative grid-pattern overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'hsl(168 80% 50%)' }} />
        <div className="absolute bottom-10 right-1/4 w-60 h-60 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: 'hsl(262 80% 65%)' }} />

        <div className="relative max-w-5xl mx-auto px-6 py-28 md:py-40 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6"
              style={{
                background: 'hsl(168 80% 50% / 0.1)',
                color: 'hsl(168 80% 50%)',
                border: '1px solid hsl(168 80% 50% / 0.25)',
              }}
            >
              Interactive Learning Platform
            </span>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6"
          >
            <span style={{ color: 'hsl(0 0% 96%)' }}>Algorithm</span>
            <br />
            <span className="gradient-text">Visualizer</span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: 'hsl(220 10% 55%)' }}
          >
            Play, pause, and understand every step of complex algorithms through
            beautiful interactive animations.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex flex-wrap justify-center gap-4">
            <Link to="/sortingalgorithms" className="btn-primary px-8 py-3.5 text-base">
              Get Started →
            </Link>
            <Link to="/graphalgorithms" className="btn-outline px-8 py-3.5 text-base">
              Explore Graphs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        <div className="card rounded-2xl p-1 grid grid-cols-3 divide-x" style={{ borderColor: 'hsl(220 14% 18%)' }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i}
              className="text-center py-6"
              style={{ borderColor: 'hsl(220 14% 18%)' }}
            >
              <div className="text-3xl md:text-4xl font-black gradient-text">{stat.value}</div>
              <div className="text-sm mt-1" style={{ color: 'hsl(220 10% 50%)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'hsl(0 0% 96%)' }}>
            Explore <span className="gradient-text">Categories</span>
          </h2>
          <p style={{ color: 'hsl(220 10% 50%)' }}>Choose a topic and start visualizing</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.to}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i}
            >
              <Link to={cat.to} className="card block p-6 group">
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{cat.icon}</span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold mb-1 group-hover:gradient-text transition-all" style={{ color: 'hsl(0 0% 96%)' }}>
                      {cat.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'hsl(220 10% 50%)' }}>
                      {cat.description}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    style={{ color: 'hsl(168 80% 50%)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "⚡", title: "Real-time", desc: "Watch algorithms execute step-by-step" },
            { icon: "🎮", title: "Interactive", desc: "Control speed, pause, and replay anytime" },
            { icon: "📖", title: "Educational", desc: "Explanations with every operation" },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i}
              className="card p-6 text-center"
            >
              <span className="text-4xl block mb-3">{f.icon}</span>
              <h3 className="font-semibold mb-1" style={{ color: 'hsl(0 0% 96%)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'hsl(220 10% 50%)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

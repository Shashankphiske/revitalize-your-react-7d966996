import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
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

  const features = [
    { icon: "⚡", title: "Real-time", desc: "Watch algorithms execute step-by-step" },
    { icon: "🎮", title: "Interactive", desc: "Control speed, pause, and replay anytime" },
    { icon: "📖", title: "Educational", desc: "Explanations with every operation" },
  ];

  const cardBase =
    "card rounded-2xl p-6 h-full flex flex-col justify-between";

  return (
    <div className="min-h-screen pt-16">

      {/* HERO */}
      <section className="relative grid-pattern overflow-hidden">
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "hsl(168 80% 50%)" }} />
        <div className="absolute bottom-10 right-1/4 w-60 h-60 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "hsl(262 80% 65%)" }} />

        <div className="relative max-w-5xl mx-auto px-6 py-28 md:py-40 text-center">

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-5xl md:text-7xl font-black leading-[0.9] mb-6"
          >
            <span style={{ color: "hsl(0 0% 96%)" }}>Algorithm</span>
            <br />
            <span className="gradient-text">Visualizer</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: "hsl(220 10% 55%)" }}
          >
            Play, pause, and understand every step of complex algorithms through
            beautiful interactive animations.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/sortingalgorithms" className="btn-primary px-8 py-3.5">
              Get Started →
            </Link>
            <Link to="/graphalgorithms" className="btn-outline px-8 py-3.5">
              Explore Graphs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS (uniform height fix) */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        <div className="card rounded-2xl grid grid-cols-3 divide-x overflow-hidden">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="flex flex-col items-center justify-center py-8 h-28"
            >
              <div className="text-3xl font-black gradient-text">
                {stat.value}
              </div>
              <div className="text-sm mt-1 text-center text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES (FIXED UNIFORM CARDS) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Explore <span className="gradient-text">Categories</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.to}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="h-full"
            >
              <Link to={cat.to} className={cardBase}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{cat.icon}</span>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {cat.title}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  Click to explore →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES (FIXED HEIGHT) */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-fr">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="h-full"
            >
              <div className={`${cardBase} text-center`}>
                <div>
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h3 className="text-white font-semibold mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-400">{f.desc}</p>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  Built for clarity
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
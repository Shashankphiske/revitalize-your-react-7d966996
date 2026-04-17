import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/sortingalgorithms", label: "🔢 Sorting" },
    { to: "/searchingalgorithms", label: "🔍 Searching" },
    { to: "/graphalgorithms", label: "🕸️ Graphs" },
    { to: "/treealgorithms", label: "🌳 Trees" },
    { to: "/stackalgorithms", label: "📚 Stacks" },
    { to: "/queuealgorithms", label: "🎫 Queues" },
    { to: "/linkedlistalgorithms", label: "🔗 Linked Lists" },
    { to: "/shortestpathalgorithms", label: "🗺️ Shortest Path" },
    { to: "/dynamicalgorithms", label: "🧩 Dynamic Programming" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'hsl(220 20% 6% / 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid hsl(220 14% 18% / 0.6)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center glow" style={{ background: 'hsl(168 80% 50%)' }}>
            <span className="text-sm font-black" style={{ color: 'hsl(220 20% 6%)' }}>A</span>
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: 'hsl(0 0% 96%)' }}>
            Algo<span className="gradient-text">Visualizer</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              color: location.pathname === '/' ? 'hsl(168 80% 50%)' : 'hsl(220 10% 60%)',
              background: location.pathname === '/' ? 'hsl(168 80% 50% / 0.1)' : 'transparent',
            }}
          >
            Home
          </Link>

          {/* Algorithms Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all"
              style={{ color: 'hsl(220 10% 60%)' }}
            >
              Algorithms
              <svg
                className="w-3.5 h-3.5 transition-transform"
                style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 w-56 rounded-xl p-2 z-50"
                  style={{
                    background: 'hsl(220 18% 12%)',
                    border: '1px solid hsl(220 14% 20%)',
                    boxShadow: '0 20px 60px hsl(0 0% 0% / 0.5)',
                  }}
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-all"
          style={{ color: 'hsl(0 0% 96%)' }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid hsl(220 14% 18%)' }}
          >
            <div className="p-4 flex flex-col gap-1">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="dropdown-item">Home</Link>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="dropdown-item"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

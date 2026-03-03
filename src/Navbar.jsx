import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // <div className="glass fixed z-50 px-6 py-4 h-28 w-full">
    //   <div className=" flex justify-between items-center">
    //     {/* Logo */




    //   </div>

    //   {/* Mobile Menu */}

    //   )}
    // </div>
    <div className="w-full h-28 glass fixed z-40 flex flex-row justify-between items-center px-40 py-2">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center glow">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <span className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform">
            AlgoVisualizer
          </span>
        </Link>
                {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex flex-row">
          <Link 
            to="/" 
            className="text-gray-300 hover:text-white transition-all hover:scale-105 text-[1vw]"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
<div className="relative group">
  <button className="text-gray-300 hover:text-white transition-all flex items-center gap-1 text-[1vw]">
    Algorithms
    <svg
      className="w-4 h-4 transition-transform group-hover:rotate-180"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Dropdown */}
  <div className="
    absolute top-full left-0 mt-3
    w-64
    rounded-xl p-4
    opacity-0 invisible
    group-hover:opacity-100 group-hover:visible
    transition-all duration-300
    bg-white/95 backdrop-blur-xl
    border border-gray-200 shadow-2xl
    z-50
  ">
    <div className="grid grid-cols-1 gap-2">
      <Link to="/sortingalgorithms" className="dropdown-item">🔢 Sorting Algorithms</Link>
      <Link to="/searchingalgorithms" className="dropdown-item">🔍 Searching Algorithms</Link>
      <Link to="/graphalgorithms" className="dropdown-item">🕸️ Graph Algorithms</Link>
      <Link to="/treealgorithms" className="dropdown-item">🌳 Tree Traversals</Link>
      <Link to="/stackalgorithms" className="dropdown-item">📚 Stack Operations</Link>
      <Link to="/queuealgorithms" className="dropdown-item">🎫 Queue Operations</Link>
      <Link to="/linkedlistalgorithms" className="dropdown-item">🔗 Linked List Operations</Link>
      <Link to="/shortestpathalgorithms" className="dropdown-item">🗺️ Shortest Path Algorithms</Link>
    </div>
  </div>
</div>

          {/* <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full btn-primary text-white font-medium hover:scale-105 transition-all"
          >
            ⭐ Star on GitHub
          </a> */}
        </div>
                {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {isMenuOpen && (
        <div className="md:hidden mt-4 glass-card rounded-xl p-4">
          <Link to="/" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-all">Home</Link>
          <Link to="/sortingalgorithms" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-all">Sorting</Link>
          <Link to="/searchingalgorithms" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-all">Searching</Link>
          <Link to="/graphalgorithms" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-all">Graph</Link>
          <Link to="/treealgorithms" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-all">Tree</Link>
          <Link to="/stackalgorithms" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-all">Stack</Link>
          <Link to="/queuealgorithms" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-all">Queue</Link>
          <Link to="/linkedlistalgorithms" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-all">Linked List</Link>
          <Link to="/shortestpathalgorithms" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-all">Shortest Path</Link>
        </div>
        )}
    </div>
  );
};

export default Navbar;


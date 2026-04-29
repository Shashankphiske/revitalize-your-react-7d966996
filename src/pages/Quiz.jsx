import { useState } from "react";
import { Brain, RefreshCw, ArrowRight, CheckCircle, XCircle, Target, AlertTriangle, Hash, Search, Network, TreePine, Layers, Link2, Map, Puzzle, ArrowLeft } from "lucide-react";
import { AlgoPageShell, AlgoPageHeader } from "../AlgoPageTemplate";

const QUIZ_CATEGORIES = [
  { id: "All", title: "All Algorithms", desc: "Comprehensive test on everything", Icon: Brain },
  { id: "Sorting", title: "Sorting", desc: "Bubble, Quick, Merge...", Icon: Hash },
  { id: "Searching", title: "Searching", desc: "Binary, Linear", Icon: Search },
  { id: "Graphs", title: "Graphs", desc: "BFS, DFS", Icon: Network },
  { id: "Trees", title: "Trees", desc: "Traversals", Icon: TreePine },
  { id: "Stacks & Queues", title: "Stacks & Queues", desc: "LIFO and FIFO", Icon: Layers },
  { id: "Linked Lists", title: "Linked Lists", desc: "Nodes and Pointers", Icon: Link2 },
  { id: "Shortest Path", title: "Shortest Path", desc: "Dijkstra, A*", Icon: Map },
  { id: "Dynamic Programming", title: "Dynamic Programming", desc: "Fibonacci, Coin Change", Icon: Puzzle },
];

const ALL_QUESTIONS = [
  // Sorting
  { category: "Sorting", topic: "Bubble Sort", q: "Array: [3, 1, 4, 2]. After ONE full pass of Bubble Sort, what is the array?", opts: ["[1, 3, 2, 4]", "[1, 2, 3, 4]", "[3, 1, 2, 4]", "[1, 3, 4, 2]"], ans: 0, exp: "After one full pass, the largest element (4) bubbles to the end. Comparisons: 3>1 swap→[1,3,4,2], 3<4 no swap, 4>2 swap→[1,3,2,4]." },
  { category: "Sorting", topic: "Selection Sort", q: "In Selection Sort, after the first pass on [5, 3, 1, 4, 2], what is the array?", opts: ["[1, 3, 5, 4, 2]", "[3, 5, 1, 4, 2]", "[1, 2, 3, 4, 5]", "[1, 5, 3, 4, 2]"], ans: 0, exp: "The minimum element (1) is swapped with the first element (5)." },
  { category: "Sorting", topic: "Insertion Sort", q: "Insertion Sort on [7,3,5,1]. After processing element at index 2 (value 5), the sorted portion is:", opts: ["[3,5,7]", "[3,7,5]", "[5,7,3]", "[1,3,5]"], ans: 0, exp: "After processing indices 0→2: [7] sorted, then 3<7 so [3,7], then 5<7 but >3 so [3,5,7]." },
  { category: "Sorting", topic: "Merge Sort", q: "Merge Sort on [4,1,3,2]. What are the final two subarrays merged?", opts: ["[1,4] and [2,3]", "[1,2] and [3,4]", "[4,1] and [2,3]", "[1,3] and [2,4]"], ans: 0, exp: "Left half [4,1] sorts to [1,4]. Right half [3,2] sorts to [2,3]." },
  { category: "Sorting", topic: "Quick Sort", q: "What is the worst-case time complexity of Quick Sort?", opts: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], ans: 1, exp: "When the pivot is always the min or max (like in an already sorted array), Quick Sort degrades to O(n²) due to unbalanced partitions." },
  { category: "Sorting", topic: "Heap Sort", q: "Which data structure is fundamentally used in Heap Sort?", opts: ["Binary Search Tree", "Max-Heap or Min-Heap", "Hash Table", "Stack"], ans: 1, exp: "Heap Sort builds a heap (usually Max-Heap for ascending order) and repeatedly extracts the root." },

  // Searching
  { category: "Searching", topic: "Binary Search", q: "Binary Search on [2,5,8,12,16,23,38,45]. Target = 16. How many comparisons?", opts: ["2", "3", "4", "5"], ans: 1, exp: "mid=12→left half eliminated. mid=8→right. mid=16→found! That's 3 comparisons." },
  { category: "Searching", topic: "Linear Search", q: "What is the best-case time complexity of Linear Search?", opts: ["O(n)", "O(log n)", "O(1)", "O(n²)"], ans: 2, exp: "The best case is O(1) when the target element is at the very first index." },

  // Graphs
  { category: "Graphs", topic: "BFS (Graphs)", q: "Which data structure is typically used to implement Breadth-First Search (BFS)?", opts: ["Stack", "Queue", "Priority Queue", "Linked List"], ans: 1, exp: "BFS explores nodes level by level, which naturally fits the FIFO (First-In-First-Out) behavior of a Queue." },
  { category: "Graphs", topic: "DFS (Graphs)", q: "Depth-First Search (DFS) can be implemented iteratively using which data structure?", opts: ["Queue", "Priority Queue", "Stack", "Min-Heap"], ans: 2, exp: "DFS goes deep before going wide, which fits the LIFO (Last-In-First-Out) behavior of a Stack (or the call stack via recursion)." },

  // Trees
  { category: "Trees", topic: "Tree Preorder", q: "In a Preorder traversal, what is the order of node visitation?", opts: ["Left, Root, Right", "Left, Right, Root", "Root, Left, Right", "Right, Root, Left"], ans: 2, exp: "Preorder visits the Root first, then the Left subtree, then the Right subtree." },
  { category: "Trees", topic: "Tree Inorder", q: "An Inorder traversal of a Binary Search Tree (BST) visits nodes in what order?", opts: ["Random order", "Descending order", "Ascending order", "Level-by-level"], ans: 2, exp: "Inorder traversal (Left, Root, Right) of a BST naturally processes nodes in ascending order." },
  { category: "Trees", topic: "Tree Postorder", q: "Which traversal is best suited for deleting an entire tree?", opts: ["Inorder", "Preorder", "Postorder", "Level-order"], ans: 2, exp: "Postorder visits children before the root, meaning you delete child nodes before deleting their parent." },

  // Stacks & Queues
  { category: "Stacks & Queues", topic: "Stacks", q: "Stack: [10,20,30,40] (40 on top). After 2 pops, top is:", opts: ["10", "20", "30", "40"], ans: 1, exp: "Pop 40 → top=30. Pop 30 → top=20." },
  { category: "Stacks & Queues", topic: "Queues", q: "In a standard Queue, elements are added at the ___ and removed from the ___.", opts: ["Front, Rear", "Rear, Front", "Top, Bottom", "Rear, Rear"], ans: 1, exp: "Queues follow FIFO (First-In-First-Out), adding at the Rear (enqueue) and removing from the Front (dequeue)." },

  // Linked Lists
  { category: "Linked Lists", topic: "Linked Lists", q: "Linked list: 10→20→30→40. After inserting 25 at position 2, the list is:", opts: ["10→25→20→30→40", "10→20→25→30→40", "10→20→30→25→40", "25→10→20→30→40"], ans: 1, exp: "Position 2 (0-indexed) is between 20 and 30. Result: 10→20→25→30→40." },

  // Shortest Path
  { category: "Shortest Path", topic: "Dijkstra's Algorithm", q: "Dijkstra's Algorithm fails or may produce incorrect results if the graph has:", opts: ["Cycles", "Negative weight edges", "More edges than vertices", "Directed edges"], ans: 1, exp: "Dijkstra's assumes all edge weights are non-negative. Negative weights can break its greedy approach." },
  { category: "Shortest Path", topic: "A* Search", q: "What makes A* Search different from Dijkstra's Algorithm?", opts: ["It doesn't use edge weights", "It uses a heuristic function to guide the search", "It only works on trees", "It uses a LIFO stack"], ans: 1, exp: "A* introduces a heuristic (like straight-line distance) to prioritize exploring paths that are more likely to lead to the goal faster." },

  // Dynamic Programming
  { category: "Dynamic Programming", topic: "Dynamic Programming (Fibonacci)", q: "What is the primary advantage of using Dynamic Programming for the Fibonacci sequence?", opts: ["It avoids recursion completely", "It reduces time complexity from O(2ⁿ) to O(n) by caching results", "It uses O(1) time complexity", "It generates larger numbers"], ans: 1, exp: "DP avoids redundant calculations by storing previously computed values (memoization or tabulation)." },
  { category: "Dynamic Programming", topic: "Dynamic Programming (Coin Change)", q: "The Coin Change problem is a classic example of which DP pattern?", opts: ["0/1 Knapsack", "Unbounded Knapsack", "Longest Common Subsequence", "Matrix Chain Multiplication"], ans: 1, exp: "In Coin Change, you have an unlimited supply of each coin denomination, making it an Unbounded Knapsack problem." },
];

const Quiz = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [wrongTopics, setWrongTopics] = useState(new Set());
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = (categoryId) => {
    const filtered = categoryId === "All" 
      ? ALL_QUESTIONS 
      : ALL_QUESTIONS.filter(q => q.category === categoryId);
    
    setQuestions(filtered);
    setSelectedCategory(categoryId);
    resetQuizState();
  };

  const answerQuiz = (choice) => {
    if (answered) return;
    const q = questions[idx];
    const isCorrect = choice === q.ans;
    
    setAnswered(true);
    setSelectedChoice(choice);
    
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      setWrongTopics(prev => {
        const newSet = new Set(prev);
        newSet.add(q.topic);
        return newSet;
      });
    }
  };

  const nextQuestion = () => {
    if (idx + 1 >= questions.length) {
      setQuizFinished(true);
    } else {
      setIdx(i => i + 1);
      setAnswered(false);
      setSelectedChoice(null);
    }
  };

  const resetQuizState = () => {
    setIdx(0);
    setScore(0);
    setAnswered(false);
    setSelectedChoice(null);
    setQuizFinished(false);
    setWrongTopics(new Set());
  };

  const exitQuiz = () => {
    setSelectedCategory(null);
    setQuestions([]);
  };

  // 1. Render Category Selection
  if (!selectedCategory) {
    return (
      <AlgoPageShell>
        <AlgoPageHeader
          icon={Brain}
          title="Algorithm Quiz Mode"
          description="Select a specific topic to test your knowledge, or take the comprehensive quiz covering all data structures and algorithms."
        />
        
        <div className="max-w-6xl mx-auto px-4 mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {QUIZ_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => startQuiz(cat.id)}
                className="card card-hover p-6 h-full flex flex-col justify-between group cursor-pointer border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: cat.id === "All" ? "hsl(var(--accent))" : "hsl(var(--accent) / 0.1)",
                      border: "1px solid hsl(var(--accent) / 0.25)",
                    }}
                  >
                    <cat.Icon size={22} className={cat.id === "All" ? "text-[hsl(var(--bg))]" : "text-[hsl(var(--accent))]"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="display text-lg font-bold text-[hsl(var(--text))] mb-1">{cat.title}</h3>
                    <p className="text-sm text-[hsl(var(--text-2))] leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
                <div className="mt-6 text-sm font-bold text-[hsl(var(--text-3))] flex items-center gap-2 group-hover:text-[hsl(var(--accent))] transition-colors">
                  Start Quiz <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AlgoPageShell>
    );
  }

  // 2. Render Quiz Interface
  return (
    <AlgoPageShell>
      <div className="max-w-3xl mx-auto mb-6">
        <button 
          onClick={exitQuiz}
          className="flex items-center gap-2 text-[hsl(var(--text-2))] hover:text-[hsl(var(--accent))] transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Categories
        </button>
      </div>

      <AlgoPageHeader
        icon={Brain}
        title={`${QUIZ_CATEGORIES.find(c => c.id === selectedCategory)?.title} Quiz`}
        description="Test your understanding. Identify your weak spots and master the concepts."
      />

      <div className="max-w-3xl mx-auto space-y-6 mt-8">
        {!quizFinished ? (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[hsl(var(--accent))]">
                Question {idx + 1} of {questions.length}
                <span className="ml-3 text-sm font-medium px-2 py-1 bg-[hsl(var(--bg-3))] text-[hsl(var(--text-2))] rounded">
                  {questions[idx].topic}
                </span>
              </h2>
              <div className="font-mono text-[hsl(var(--text-2))] bg-[hsl(var(--bg-2))] px-4 py-2 rounded-lg border border-[hsl(var(--border))]">
                Score: {score} / {idx + (answered ? 1 : 0)}
              </div>
            </div>

            <div className="bg-[hsl(var(--bg-2))] border border-[hsl(var(--accent-2))/0.3] rounded-xl p-6 mb-6">
              <p className="text-lg font-bold mb-6 text-[hsl(var(--text))] leading-relaxed">
                {questions[idx].q}
              </p>
              
              <div className="flex flex-col gap-3">
                {questions[idx].opts.map((opt, i) => {
                  let btnClass = "text-left px-5 py-4 rounded-xl border font-medium transition-all duration-200 ";
                  
                  if (answered) {
                    if (i === questions[idx].ans) {
                      btnClass += "border-[hsl(var(--accent))] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))]";
                    } else if (i === selectedChoice) {
                      btnClass += "border-[hsl(var(--accent-4))] bg-[hsl(var(--accent-4))/0.1] text-[hsl(var(--accent-4))]";
                    } else {
                      btnClass += "border-[hsl(var(--border))] bg-[hsl(var(--bg-3))] opacity-50";
                    }
                  } else {
                    btnClass += "border-[hsl(var(--border))] bg-[hsl(var(--bg-3))] hover:border-[hsl(var(--accent-2))] hover:text-[hsl(var(--accent-2))] cursor-pointer";
                  }

                  return (
                    <button
                      key={i}
                      disabled={answered}
                      onClick={() => answerQuiz(i)}
                      className={btnClass}
                    >
                      <span className="font-mono font-bold mr-3">{String.fromCharCode(65+i)}.</span> {opt}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`mt-6 p-4 rounded-xl border flex gap-3 ${selectedChoice === questions[idx].ans ? 'bg-[hsl(var(--accent))/0.08] border-[hsl(var(--accent))] text-[hsl(var(--accent))]' : 'bg-[hsl(var(--accent-4))/0.08] border-[hsl(var(--accent-4))] text-[hsl(var(--accent-4))]'}`}>
                  <div className="mt-0.5 shrink-0">
                    {selectedChoice === questions[idx].ans ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <strong className="block mb-1">{selectedChoice === questions[idx].ans ? "Correct!" : "Incorrect."}</strong>
                    <p className="opacity-90">{questions[idx].exp}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 flex-col sm:flex-row">
              <button 
                disabled={!answered}
                className="btn flex-1 justify-center bg-[hsl(var(--accent))] text-black border-[hsl(var(--accent))] hover:bg-[#00f5c4] py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={nextQuestion}
              >
                {idx + 1 >= questions.length ? "Finish Quiz" : "Next Question"} <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center border-[hsl(var(--accent))] bg-[hsl(var(--accent))/0.02]">
            <div className="w-20 h-20 mx-auto bg-[hsl(var(--accent))/0.1] rounded-full flex items-center justify-center mb-6">
              <Target size={40} className="text-[hsl(var(--accent))]" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-[hsl(var(--text))]">Quiz Completed!</h2>
            
            <div className="text-5xl font-mono font-extrabold text-[hsl(var(--accent))] mb-8">
              {score} <span className="text-2xl text-[hsl(var(--text-3))]">/ {questions.length}</span>
            </div>

            {wrongTopics.size > 0 ? (
              <div className="bg-[hsl(var(--bg-2))] border border-[hsl(var(--accent-4))/0.3] rounded-xl p-6 text-left mb-8 max-w-lg mx-auto">
                <div className="flex items-center gap-2 mb-4 text-[hsl(var(--accent-4))]">
                  <AlertTriangle size={20} />
                  <h3 className="font-bold text-lg">Areas for Improvement</h3>
                </div>
                <p className="text-[hsl(var(--text-2))] mb-4 text-sm">
                  Based on your answers, you should review the following topics:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[hsl(var(--text))] font-medium">
                  {Array.from(wrongTopics).map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-[hsl(var(--accent))/0.1] border border-[hsl(var(--accent))/0.3] rounded-xl p-6 mb-8 max-w-lg mx-auto">
                <h3 className="font-bold text-lg text-[hsl(var(--accent))] mb-2">Perfect Score! 🎉</h3>
                <p className="text-[hsl(var(--text-2))]">You have a flawless understanding of these algorithms. Excellent work!</p>
              </div>
            )}

            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <button 
                className="btn justify-center bg-[hsl(var(--accent))] text-black border-[hsl(var(--accent))] hover:bg-[#00f5c4] py-3 px-8 text-base" 
                onClick={resetQuizState}
              >
                <RefreshCw size={18} className="mr-2" /> Retake Quiz
              </button>
              <button 
                className="btn justify-center py-3 px-8 text-base" 
                onClick={exitQuiz}
              >
                Back to Categories
              </button>
            </div>
          </div>
        )}
      </div>
    </AlgoPageShell>
  );
};

export default Quiz;

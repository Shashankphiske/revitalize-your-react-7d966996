// Curated LeetCode problems per algorithm topic.
// Each problem: { id, title, difficulty: "Easy"|"Medium"|"Hard", url, tags? }

const LC = (id, title, difficulty, slug, tags = []) => ({
  id,
  title,
  difficulty,
  url: `https://leetcode.com/problems/${slug}/`,
  tags,
});

export const LEETCODE_PROBLEMS = {
  // ── Sorting ──────────────────────────────────────────────
  bubbleSort: [
    LC(912, "Sort an Array",                 "Medium", "sort-an-array", ["Sorting"]),
    LC(283, "Move Zeroes",                   "Easy",   "move-zeroes", ["Two Pointers"]),
    LC(88,  "Merge Sorted Array",            "Easy",   "merge-sorted-array", ["Two Pointers"]),
    LC(1051,"Height Checker",                "Easy",   "height-checker"),
  ],
  selectionSort: [
    LC(912, "Sort an Array",                 "Medium", "sort-an-array"),
    LC(215, "Kth Largest Element in Array",  "Medium", "kth-largest-element-in-an-array"),
    LC(1636,"Sort Array by Increasing Frequency","Easy","sort-array-by-increasing-frequency"),
  ],
  insertionSort: [
    LC(147, "Insertion Sort List",           "Medium", "insertion-sort-list", ["Linked List"]),
    LC(912, "Sort an Array",                 "Medium", "sort-an-array"),
    LC(2191,"Sort the Jumbled Numbers",      "Medium", "sort-the-jumbled-numbers"),
  ],
  mergeSort: [
    LC(912, "Sort an Array",                 "Medium", "sort-an-array"),
    LC(148, "Sort List",                     "Medium", "sort-list", ["Linked List"]),
    LC(23,  "Merge k Sorted Lists",          "Hard",   "merge-k-sorted-lists", ["Heap"]),
    LC(315, "Count of Smaller Numbers After Self","Hard","count-of-smaller-numbers-after-self"),
    LC(493, "Reverse Pairs",                 "Hard",   "reverse-pairs"),
  ],
  quickSort: [
    LC(215, "Kth Largest Element in Array",  "Medium", "kth-largest-element-in-an-array"),
    LC(75,  "Sort Colors",                   "Medium", "sort-colors", ["Dutch National Flag"]),
    LC(912, "Sort an Array",                 "Medium", "sort-an-array"),
    LC(324, "Wiggle Sort II",                "Medium", "wiggle-sort-ii"),
  ],
  heapSort: [
    LC(215, "Kth Largest Element in Array",  "Medium", "kth-largest-element-in-an-array"),
    LC(347, "Top K Frequent Elements",       "Medium", "top-k-frequent-elements"),
    LC(703, "Kth Largest in Stream",         "Easy",   "kth-largest-element-in-a-stream"),
    LC(295, "Find Median from Data Stream",  "Hard",   "find-median-from-data-stream"),
    LC(23,  "Merge k Sorted Lists",          "Hard",   "merge-k-sorted-lists"),
  ],

  // ── Searching ────────────────────────────────────────────
  binarySearch: [
    LC(704, "Binary Search",                 "Easy",   "binary-search"),
    LC(35,  "Search Insert Position",        "Easy",   "search-insert-position"),
    LC(33,  "Search in Rotated Sorted Array","Medium", "search-in-rotated-sorted-array"),
    LC(34,  "Find First and Last Position",  "Medium", "find-first-and-last-position-of-element-in-sorted-array"),
    LC(153, "Find Min in Rotated Sorted Array","Medium","find-minimum-in-rotated-sorted-array"),
    LC(74,  "Search a 2D Matrix",            "Medium", "search-a-2d-matrix"),
    LC(4,   "Median of Two Sorted Arrays",   "Hard",   "median-of-two-sorted-arrays"),
  ],
  linearSearch: [
    LC(1,   "Two Sum (brute)",               "Easy",   "two-sum"),
    LC(27,  "Remove Element",                "Easy",   "remove-element"),
    LC(485, "Max Consecutive Ones",          "Easy",   "max-consecutive-ones"),
    LC(2418,"Sort the People",               "Easy",   "sort-the-people"),
  ],

  // ── Graphs ───────────────────────────────────────────────
  bfs: [
    LC(102, "Binary Tree Level Order Traversal","Medium","binary-tree-level-order-traversal"),
    LC(200, "Number of Islands",             "Medium", "number-of-islands"),
    LC(994, "Rotting Oranges",               "Medium", "rotting-oranges"),
    LC(127, "Word Ladder",                   "Hard",   "word-ladder"),
    LC(1091,"Shortest Path in Binary Matrix","Medium", "shortest-path-in-binary-matrix"),
    LC(542, "01 Matrix",                     "Medium", "01-matrix"),
  ],
  dfs: [
    LC(200, "Number of Islands",             "Medium", "number-of-islands"),
    LC(695, "Max Area of Island",            "Medium", "max-area-of-island"),
    LC(133, "Clone Graph",                   "Medium", "clone-graph"),
    LC(207, "Course Schedule",               "Medium", "course-schedule", ["Topological Sort"]),
    LC(417, "Pacific Atlantic Water Flow",   "Medium", "pacific-atlantic-water-flow"),
    LC(329, "Longest Increasing Path in Matrix","Hard","longest-increasing-path-in-a-matrix"),
  ],

  // ── Trees ────────────────────────────────────────────────
  inorder: [
    LC(94,  "Binary Tree Inorder Traversal", "Easy",   "binary-tree-inorder-traversal"),
    LC(98,  "Validate Binary Search Tree",   "Medium", "validate-binary-search-tree"),
    LC(230, "Kth Smallest Element in BST",   "Medium", "kth-smallest-element-in-a-bst"),
    LC(173, "Binary Search Tree Iterator",   "Medium", "binary-search-tree-iterator"),
  ],
  preorder: [
    LC(144, "Binary Tree Preorder Traversal","Easy",   "binary-tree-preorder-traversal"),
    LC(105, "Construct Tree from Preorder & Inorder","Medium","construct-binary-tree-from-preorder-and-inorder-traversal"),
    LC(297, "Serialize and Deserialize Binary Tree","Hard","serialize-and-deserialize-binary-tree"),
    LC(589, "N-ary Tree Preorder Traversal", "Easy",   "n-ary-tree-preorder-traversal"),
  ],
  postorder: [
    LC(145, "Binary Tree Postorder Traversal","Easy",  "binary-tree-postorder-traversal"),
    LC(124, "Binary Tree Maximum Path Sum",  "Hard",   "binary-tree-maximum-path-sum"),
    LC(543, "Diameter of Binary Tree",       "Easy",   "diameter-of-binary-tree"),
    LC(110, "Balanced Binary Tree",          "Easy",   "balanced-binary-tree"),
  ],

  // ── Stacks & Queues ──────────────────────────────────────
  stackPush: [
    LC(20,  "Valid Parentheses",             "Easy",   "valid-parentheses"),
    LC(155, "Min Stack",                     "Medium", "min-stack"),
    LC(496, "Next Greater Element I",        "Easy",   "next-greater-element-i"),
    LC(739, "Daily Temperatures",            "Medium", "daily-temperatures"),
    LC(150, "Evaluate Reverse Polish Notation","Medium","evaluate-reverse-polish-notation"),
  ],
  stackPop: [
    LC(20,  "Valid Parentheses",             "Easy",   "valid-parentheses"),
    LC(232, "Implement Queue using Stacks",  "Easy",   "implement-queue-using-stacks"),
    LC(844, "Backspace String Compare",      "Easy",   "backspace-string-compare"),
    LC(394, "Decode String",                 "Medium", "decode-string"),
    LC(84,  "Largest Rectangle in Histogram","Hard",   "largest-rectangle-in-histogram"),
  ],
  queueEnqueue: [
    LC(225, "Implement Stack using Queues",  "Easy",   "implement-stack-using-queues"),
    LC(622, "Design Circular Queue",         "Medium", "design-circular-queue"),
    LC(933, "Number of Recent Calls",        "Easy",   "number-of-recent-calls"),
    LC(102, "Level Order Traversal",         "Medium", "binary-tree-level-order-traversal"),
  ],
  queueDequeue: [
    LC(239, "Sliding Window Maximum",        "Hard",   "sliding-window-maximum", ["Deque"]),
    LC(641, "Design Circular Deque",         "Medium", "design-circular-deque"),
    LC(346, "Moving Average from Data Stream","Easy",  "moving-average-from-data-stream"),
    LC(1700,"Number of Students Unable to Eat Lunch","Easy","number-of-students-unable-to-eat-lunch"),
  ],

  // ── Linked Lists ─────────────────────────────────────────
  singlyInsertion: [
    LC(2,   "Add Two Numbers",               "Medium", "add-two-numbers"),
    LC(21,  "Merge Two Sorted Lists",        "Easy",   "merge-two-sorted-lists"),
    LC(86,  "Partition List",                "Medium", "partition-list"),
    LC(708, "Insert into a Sorted Circular List","Medium","insert-into-a-sorted-circular-linked-list"),
  ],
  singlyDeletion: [
    LC(203, "Remove Linked List Elements",   "Easy",   "remove-linked-list-elements"),
    LC(237, "Delete Node in a Linked List",  "Medium", "delete-node-in-a-linked-list"),
    LC(19,  "Remove Nth Node From End",      "Medium", "remove-nth-node-from-end-of-list"),
    LC(83,  "Remove Duplicates from Sorted List","Easy","remove-duplicates-from-sorted-list"),
    LC(82,  "Remove Duplicates from Sorted List II","Medium","remove-duplicates-from-sorted-list-ii"),
  ],
  singlyReversal: [
    LC(206, "Reverse Linked List",           "Easy",   "reverse-linked-list"),
    LC(92,  "Reverse Linked List II",        "Medium", "reverse-linked-list-ii"),
    LC(25,  "Reverse Nodes in k-Group",      "Hard",   "reverse-nodes-in-k-group"),
    LC(234, "Palindrome Linked List",        "Easy",   "palindrome-linked-list"),
    LC(143, "Reorder List",                  "Medium", "reorder-list"),
  ],
  doublyInsertion: [
    LC(146, "LRU Cache",                     "Medium", "lru-cache", ["Doubly Linked List"]),
    LC(460, "LFU Cache",                     "Hard",   "lfu-cache"),
    LC(708, "Insert into Sorted Circular List","Medium","insert-into-a-sorted-circular-linked-list"),
    LC(430, "Flatten a Multilevel Doubly Linked List","Medium","flatten-a-multilevel-doubly-linked-list"),
  ],
  doublyDeletion: [
    LC(146, "LRU Cache",                     "Medium", "lru-cache"),
    LC(1472,"Design Browser History",        "Medium", "design-browser-history"),
    LC(430, "Flatten Multilevel Doubly Linked List","Medium","flatten-a-multilevel-doubly-linked-list"),
  ],
  doublyReversal: [
    LC(206, "Reverse Linked List",           "Easy",   "reverse-linked-list"),
    LC(92,  "Reverse Linked List II",        "Medium", "reverse-linked-list-ii"),
    LC(1721,"Swapping Nodes in a Linked List","Medium","swapping-nodes-in-a-linked-list"),
  ],

  // ── Shortest Path ────────────────────────────────────────
  dijkstra: [
    LC(743, "Network Delay Time",            "Medium", "network-delay-time"),
    LC(787, "Cheapest Flights Within K Stops","Medium","cheapest-flights-within-k-stops"),
    LC(1631,"Path With Minimum Effort",      "Medium", "path-with-minimum-effort"),
    LC(1976,"Number of Ways to Arrive at Destination","Medium","number-of-ways-to-arrive-at-destination"),
    LC(778, "Swim in Rising Water",          "Hard",   "swim-in-rising-water"),
  ],
  aStar: [
    LC(1091,"Shortest Path in Binary Matrix","Medium", "shortest-path-in-binary-matrix"),
    LC(773, "Sliding Puzzle",                "Hard",   "sliding-puzzle"),
    LC(127, "Word Ladder",                   "Hard",   "word-ladder"),
    LC(675, "Cut Off Trees for Golf Event",  "Hard",   "cut-off-trees-for-golf-event"),
  ],

  // ── Dynamic Programming ──────────────────────────────────
  fibonacci: [
    LC(509, "Fibonacci Number",              "Easy",   "fibonacci-number"),
    LC(70,  "Climbing Stairs",               "Easy",   "climbing-stairs"),
    LC(746, "Min Cost Climbing Stairs",      "Easy",   "min-cost-climbing-stairs"),
    LC(1137,"N-th Tribonacci Number",        "Easy",   "n-th-tribonacci-number"),
    LC(198, "House Robber",                  "Medium", "house-robber"),
  ],
  coinChange: [
    LC(322, "Coin Change",                   "Medium", "coin-change"),
    LC(518, "Coin Change II",                "Medium", "coin-change-ii"),
    LC(983, "Min Cost For Tickets",          "Medium", "minimum-cost-for-tickets"),
    LC(279, "Perfect Squares",               "Medium", "perfect-squares"),
    LC(377, "Combination Sum IV",            "Medium", "combination-sum-iv"),
  ],
};

export default LEETCODE_PROBLEMS;

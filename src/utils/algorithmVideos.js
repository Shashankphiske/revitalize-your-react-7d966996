/**
 * Algorithm Video Database
 * Maps algorithm names to YouTube video IDs for educational content
 * Videos primarily from: Khan Academy, Abdul Bari, Tech With Tim, etc.
 */

export const algorithmVideos = {
  // Tree Traversals
  'inorder': 'ER68lQm74Oo',
  'preorder': 'ER68lQm74Oo',
  'postorder': 'ER68lQm74Oo',

  // Sorting Algorithms
  'bubble-sort': '96J8A8qmvzg',
  'selection-sort': '_owzFHWM1cw',
  'insertion-sort': 'lCDtXo4XD40',
  'merge-sort': 'kgBjXUE_Nds',
  'quick-sort': 'fDqT5YwKdyc',
  'heap-sort': 'Mtoco3tjqT0',

  // Searching Algorithms
  'binary-search': 'r1F3q6XiNuY',
  'linear-search': 'gL4bP9fYQ6s',

  // Graph Algorithms
  'bfs': 'pcKY4hjDrxo',
  'dfs': 'pcKY4hjDrxo',

  // Stack Operations
  'stack-push': 'ROZeq9yCCKs',
  'stack-pop': 'ROZeq9yCCKs',

  // Queue Operations
  'queue-enqueue': '3pXQkX2I_2g',
  'queue-dequeue': '3pXQkX2I_2g',

  // Linked List Operations
  'singly-insertion': 'R9ptRmutczw',
  'singly-deletion': 'R9ptRmutczw',
  'singly-reversal': 'R9ptRmutczw',
  'doubly-insertion': 'R9ptRmutczw',
  'doubly-deletion': 'R9ptRmutczw',
  'doubly-reversal': 'R9ptRmutczw',

  // Shortest Path Algorithms
  'dijkstra': 'V6SnJtVLvWQ',
  'astar': '_7MQB1sAzxw',

  // Dynamic Programming
  'dp-fibonacci': 'IA0DfYxstRo',
};

/**
 * Get video ID for an algorithm
 * @param {string} algorithmName - The algorithm identifier
 * @returns {string|null} - YouTube video ID or null if not available
 */
export const getVideoId = (algorithmName) => {
  return algorithmVideos[algorithmName?.toLowerCase()] || null;
};

/**
 * Generate YouTube embed URL
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Embed URL
 */
export const getYouTubeEmbedUrl = (videoId) => {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};

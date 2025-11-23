export function createUnionFind(size) {
  // Each vertex starts as its own parent (separate set)
  const parent = Array.from({ length: size }, (_, i) => i);
  // Rank is used to keep trees balanced
  const rank = Array(size).fill(0);

  // Find the root of the set containing vertex x
  // Uses path compression for efficiency
  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // Path compression
    }
    return parent[x];
  }

  // Union two sets containing vertices x and y
  // Returns false if they're already in the same set (would create a cycle)
  // Returns true if they were successfully merged
  function union(x, y) {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX === rootY) return false; // Already in same set

    // Union by rank - attach smaller tree under larger tree
    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX]++;
    }
    return true;
  }

  return { find, union };
}


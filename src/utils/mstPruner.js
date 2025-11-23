// Prune unnamed leaf vertices from the MST
// A leaf is a vertex with only one connection (degree = 1)
// We remove leaves whose names start with "Point" until all leaves are named
export function pruneUnnamedLeaves(mstEdges, vertices) {
  let pruned = true;
  
  while (pruned) {
    pruned = false;
    
    // Count the degree (number of connections) for each vertex
    const degree = new Array(vertices.length).fill(0);
    mstEdges.forEach(edge => {
      degree[edge.fromIndex]++;
      degree[edge.toIndex]++;
    });
    
    // Find all leaf vertices (degree = 1) that are unnamed
    const leafToRemove = [];
    for (let i = 0; i < vertices.length; i++) {
      if (degree[i] === 1 && vertices[i].id.startsWith('Point')) {
        leafToRemove.push(i);
      }
    }
    
    // Remove edges connected to unnamed leaves
    if (leafToRemove.length > 0) {
      pruned = true;
      for (let i = mstEdges.length - 1; i >= 0; i--) {
        if (leafToRemove.includes(mstEdges[i].fromIndex) || 
            leafToRemove.includes(mstEdges[i].toIndex)) {
          mstEdges.splice(i, 1);
        }
      }
    }
  }
  
  return mstEdges;
}

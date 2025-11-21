// Union-Find (Disjoint Set) data structure for Kruskal's algorithm
class UnionFind {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false; // Already in same set

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

export function kruskalMST(geojsonData) {
  if (!geojsonData) return { edges: [], vertices: [] };

  const vertices = [];
  const edges = [];
  const vertexMap = new Map(); // Map vertex id to index

  // Extract vertices from GeoJSON
  if (geojsonData.type === 'FeatureCollection') {
    geojsonData.features.forEach(feature => {
      if (feature.geometry.type === 'Point') {
        const id = feature.properties?.id || feature.properties?.name || vertices.length;
        vertexMap.set(id, vertices.length);
        vertices.push({
          id: id,
          coords: feature.geometry.coordinates
        });
      }
    });
  } else if (geojsonData.type === 'Feature' && geojsonData.geometry.type === 'Point') {
    const id = geojsonData.properties?.id || geojsonData.properties?.name || 0;
    vertexMap.set(id, 0);
    vertices.push({
      id: id,
      coords: geojsonData.geometry.coordinates
    });
  }

  // Calculate all edges between consecutive vertices
  for (let i = 0; i < vertices.length - 1; i++) {
    const [lon1, lat1] = vertices[i].coords;
    const [lon2, lat2] = vertices[i + 1].coords;
    
    // Haversine formula for distance calculation
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    edges.push({
      from: vertices[i].id,
      to: vertices[i + 1].id,
      fromIndex: i,
      toIndex: i + 1,
      distance: distance,
      coords: [vertices[i].coords, vertices[i + 1].coords]
    });
  }

  // Sort edges by distance
  edges.sort((a, b) => a.distance - b.distance);

  // Apply Kruskal's algorithm
  const uf = new UnionFind(vertices.length);
  const mstEdges = [];

  for (const edge of edges) {
    if (uf.union(edge.fromIndex, edge.toIndex)) {
      mstEdges.push(edge);
      if (mstEdges.length === vertices.length - 1) {
        break; // MST is complete
      }
    }
  }

  return { edges: mstEdges, vertices };
}

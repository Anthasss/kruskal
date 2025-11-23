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

// Helper function to find closest vertex index for a coordinate
function findVertexIndex(vertices, coord, tolerance = 0.00001) {
  for (let i = 0; i < vertices.length; i++) {
    const [lon1, lat1] = vertices[i].coords;
    const [lon2, lat2] = coord;
    const distance = Math.sqrt(Math.pow(lon1 - lon2, 2) + Math.pow(lat1 - lat2, 2));
    if (distance < tolerance) {
      return i;
    }
  }
  return -1;
}

// Calculate distance using Haversine formula
function calculateDistance(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
}

export function kruskalMST(geojsonData) {
  if (!geojsonData) return { edges: [], vertices: [] };

  const vertices = [];
  const edges = [];

  // Extract vertices (Points) from GeoJSON
  if (geojsonData.type === 'FeatureCollection') {
    geojsonData.features.forEach((feature, idx) => {
      if (feature.geometry.type === 'Point') {
        vertices.push({
          id: feature.properties?.name || feature.properties?.id || `Point ${idx}`,
          coords: feature.geometry.coordinates
        });
      }
    });

    // Extract edges (LineStrings) from GeoJSON
    geojsonData.features.forEach(feature => {
      if (feature.geometry.type === 'LineString') {
        const coords = feature.geometry.coordinates;
        
        // Find vertex indices for start and end points of the line
        const startIdx = findVertexIndex(vertices, coords[0]);
        const endIdx = findVertexIndex(vertices, coords[coords.length - 1]);
        
        if (startIdx !== -1 && endIdx !== -1) {
          const distance = calculateDistance(coords[0], coords[coords.length - 1]);
          
          edges.push({
            from: vertices[startIdx].id,
            to: vertices[endIdx].id,
            fromIndex: startIdx,
            toIndex: endIdx,
            distance: distance,
            coords: [vertices[startIdx].coords, vertices[endIdx].coords]
          });
        }
      }
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

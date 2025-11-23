// Helper function to find the closest vertex index for a given coordinate
// Uses Euclidean distance with a small tolerance to handle floating-point precision
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

// Calculate distance between two geographic coordinates using Haversine formula
// Returns distance in meters
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

// Extract vertices and edges from GeoJSON data
export function parseGeoJSON(geojsonData) {
  if (!geojsonData || geojsonData.type !== 'FeatureCollection') {
    return { vertices: [], edges: [] };
  }

  const vertices = [];
  const edges = [];

  // Step 1: Extract all Point features as vertices
  geojsonData.features.forEach((feature, idx) => {
    if (feature.geometry.type === 'Point') {
      vertices.push({
        id: feature.properties?.name || feature.properties?.id || `Point ${idx}`,
        coords: feature.geometry.coordinates
      });
    }
  });

  // Step 2: Extract all LineString features as edges
  geojsonData.features.forEach(feature => {
    if (feature.geometry.type === 'LineString') {
      const coords = feature.geometry.coordinates;
      
      // Find which vertices this line connects
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

  return { vertices, edges };
}

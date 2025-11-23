import { useMemo } from 'react';

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

export default function DistanceTable({ geojsonData }) {
  const distances = useMemo(() => {
    if (!geojsonData) return [];

    const vertices = [];
    const distanceList = [];

    // Extract vertices from GeoJSON
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
            
            distanceList.push({
              from: vertices[startIdx].id,
              to: vertices[endIdx].id,
              distance: distance.toFixed(2)
            });
          }
        }
      });
    }

    // Sort by distance (lowest to highest) for Kruskal's algorithm
    distanceList.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return distanceList;
  }, [geojsonData]);

  return (
    <div className="w-full h-full bg-base-200 p-4 flex flex-col overflow-hidden">
      <h2 className="text-lg font-bold mb-4 shrink-0">Vertex Distances</h2>
      
      {distances.length === 0 ? (
        <p className="text-sm text-gray-500">Import a GeoJSON file to see distances</p>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {distances.map((item, index) => (
            <div key={index} className="card bg-base-100 shadow-sm p-3">
              <div className="text-sm">
                <span className="font-semibold">{item.from}</span>
                {' → '}
                <span className="font-semibold">{item.to}</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {item.distance} m
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

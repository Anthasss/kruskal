import { useMemo } from 'react';

export default function DistanceTable({ geojsonData }) {
  const distances = useMemo(() => {
    if (!geojsonData) return [];

    const vertices = [];
    const distanceList = [];

    // Extract vertices from GeoJSON
    if (geojsonData.type === 'FeatureCollection') {
      geojsonData.features.forEach(feature => {
        if (feature.geometry.type === 'Point') {
          vertices.push({
            id: feature.properties?.id || feature.properties?.name || vertices.length,
            coords: feature.geometry.coordinates
          });
        }
      });
    } else if (geojsonData.type === 'Feature' && geojsonData.geometry.type === 'Point') {
      vertices.push({
        id: geojsonData.properties?.id || geojsonData.properties?.name || 0,
        coords: geojsonData.geometry.coordinates
      });
    }

    // Calculate distances only between immediate neighbors (consecutive vertices)
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

      distanceList.push({
        from: vertices[i].id,
        to: vertices[i + 1].id,
        distance: distance.toFixed(2)
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

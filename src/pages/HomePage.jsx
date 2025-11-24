import { MapContainer, TileLayer, GeoJSON, Polyline, Marker, Tooltip } from 'react-leaflet';
import { useMemo, useEffect } from 'react';
import L from 'leaflet';
import DistanceTable from '../components/DistanceTable';
import { kruskalMST } from '../utils/kruskal';
import 'leaflet/dist/leaflet.css';

// import blue marker from leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function HomePage({ geojsonData, showMST, onMstStatsChange }) {
  // memoize MST calculation
  const mst = useMemo(() => { 
    return kruskalMST(geojsonData);
  }, [geojsonData]);

  // Memoize used vertex indices calculation (shared by namedVertices and mstStats)
  const usedVertexIndices = useMemo(() => {
    if (!mst.edges) return new Set();
    const indices = new Set();
    mst.edges.forEach(edge => {
      indices.add(edge.fromIndex);
      indices.add(edge.toIndex);
    });
    return indices;
  }, [mst.edges]);

  // Filter vertices that are part of MST and don't start with "Point"
  const namedVertices = useMemo(() => {
    if (!showMST || !mst.vertices) return [];
    
    // Filter vertices that are in MST and have names not starting with "Point"
    return mst.vertices
      .map((vertex, index) => ({ ...vertex, index }))
      .filter(vertex => 
        usedVertexIndices.has(vertex.index) && 
        !vertex.id.startsWith('Point')
      );
  }, [mst.vertices, usedVertexIndices, showMST]);

  // Memoize MST stats calculation
  const mstStats = useMemo(() => {
    if (!mst.vertices || !mst.edges) return null;
    
    const totalDistance = mst.edges.reduce((sum, edge) => sum + edge.distance, 0);
    
    return {
      totalVertices: mst.vertices.length,
      mstVertices: usedVertexIndices.size,
      totalDistance: totalDistance
    };
  }, [mst.vertices, mst.edges, usedVertexIndices]);

  // Send MST stats to parent whenever they change
  useEffect(() => {
    onMstStatsChange(mstStats);
  }, [mstStats, onMstStatsChange]);

  return (
    <div className="w-full h-full flex overflow-hidden">

      {/* main content - map */}
      <div className="flex-1 h-full">
        <MapContainer 
          center={[-10.1564148,123.6669857]} 
          zoom={30} 
          className="w-full h-full"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geojsonData && !showMST && (
            <GeoJSON 
              data={geojsonData} 
              key={JSON.stringify(geojsonData)}
              style={{ color: "green", weight: 4, opacity: 0.8 }}
            />
          )}
          {/* MST Overlay */}
          {showMST && mst.edges.map((edge, index) => (
            <Polyline
              key={index}
              positions={edge.coords.map(([lon, lat]) => [lat, lon])}
              pathOptions={{
                color: '#ef4444',
                weight: 4,
                opacity: 0.8
              }}
            />
          ))}
          {/* MST Named Vertices */}
          {showMST && namedVertices.map((vertex, index) => (
            <Marker
              key={index}
              position={[vertex.coords[1], vertex.coords[0]]}
            >
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* right sidebar - distances */}
      <div className="w-80 h-full">
        <DistanceTable geojsonData={geojsonData} mstEdges={mst.edges} />
      </div>
    </div>
  )
}
import { MapContainer, TileLayer, GeoJSON, Polyline } from 'react-leaflet';
import { useMemo } from 'react';
import DistanceTable from '../components/DistanceTable';
import { kruskalMST } from '../utils/kruskal';
import 'leaflet/dist/leaflet.css';

export default function HomePage({ geojsonData, showMST }) {
  const mst = useMemo(() => { 
    return kruskalMST(geojsonData);
  }, [geojsonData]);

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
              style={{ color: "yellow", weight: 4, opacity: 0.8 }}
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
        </MapContainer>
      </div>

      {/* right sidebar - distances */}
      <div className="w-80 h-full">
        <DistanceTable geojsonData={geojsonData} />
      </div>
    </div>
  )
}
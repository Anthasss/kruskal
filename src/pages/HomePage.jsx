import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function HomePage({ geojsonData }) {
  return (
    <div className="w-full h-full flex justify-center items-center">

      {/* main content */}
      <MapContainer 
        center={[-10.1564148,123.6669857]} 
        zoom={20} 
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geojsonData && (
          <GeoJSON 
            data={geojsonData} 
            key={JSON.stringify(geojsonData)}
          />
        )}
      </MapContainer>
    </div>
  )
}
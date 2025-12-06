export default function Navbar({ onGeojsonImport, showMST, onToggleMST, hasGraph, mstStats }) {
  const handleFileImport = (event) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.geojson')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const geojsonData = JSON.parse(e.target.result);
          console.log('GeoJSON data:', geojsonData);
          onGeojsonImport(geojsonData);
        } catch (error) {
          console.error('Error parsing GeoJSON file:', error);
          alert('Invalid GeoJSON file');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a .geojson file');
    }
  };

  return (
    <nav className="w-full p-2 bg-base-300 flex justify-between items-center">
      {/* title */}
      <h1 className="text-xl font-bold">Kruskal Algorithm Simulator</h1>

      {/* right action */}
      <div className="ml-auto h-full flex gap-4 items-center">
        {mstStats && hasGraph && (
          <div className="flex gap-4 text-sm">
            <span className="font-semibold">Total Vertices: <span className="text-primary">{mstStats.totalVertices}</span></span>
            <span className="font-semibold">MST Vertices: <span className="text-secondary">{mstStats.mstVertices}</span></span>
            <span className="font-semibold">MST Distance: <span className="text-accent">{mstStats.totalDistance.toFixed(2)} m</span></span>
          </div>
        )}
        {hasGraph && (
          <button 
            onClick={onToggleMST}
            className="btn btn-secondary"
          >
            {showMST ? 'Show Original' : 'Show MST'}
          </button>
        )}
        <input
          type="file"
          accept=".geojson"
          onChange={handleFileImport}
          className="hidden"
          id="geojson-upload"
        />
        <label htmlFor="geojson-upload" className="btn btn-primary cursor-pointer">
          Import Graph
        </label>
      </div>
    </nav>
  )
}
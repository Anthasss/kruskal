import HomePage from './pages/HomePage'
import Navbar from './components/navigation/Navbar'

import { useState } from 'react'
import './App.css'

function App() {
  const [geojsonData, setGeojsonData] = useState(null)
  const [showMST, setShowMST] = useState(true)
  const [mstStats, setMstStats] = useState(null)

  return (
    <div className="w-full h-screen grid grid-rows-[auto_1fr]">
      <Navbar 
        onGeojsonImport={setGeojsonData} 
        showMST={showMST}
        onToggleMST={() => setShowMST(!showMST)}
        hasGraph={geojsonData !== null}
        mstStats={mstStats}
      />
      <HomePage geojsonData={geojsonData} showMST={showMST} onMstStatsChange={setMstStats} />
    </div>
  )
}

export default App

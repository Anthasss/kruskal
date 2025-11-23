import HomePage from './pages/HomePage'
import Navbar from './components/navigation/Navbar'

import { useState } from 'react'
import './App.css'

function App() {
  const [geojsonData, setGeojsonData] = useState(null)
  const [showMST, setShowMST] = useState(true)

  return (
    <div className="w-full h-screen grid grid-rows-[auto_1fr]">
      <Navbar 
        onGeojsonImport={setGeojsonData} 
        showMST={showMST}
        onToggleMST={() => setShowMST(!showMST)}
        hasGraph={geojsonData !== null}
      />
      <HomePage geojsonData={geojsonData} showMST={showMST} />
    </div>
  )
}

export default App

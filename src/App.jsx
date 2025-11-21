import HomePage from './pages/HomePage'
import Navbar from './components/navigation/Navbar'

import { useState } from 'react'
import './App.css'

function App() {
  const [geojsonData, setGeojsonData] = useState(null)

  return (
    <div className="w-full h-screen grid grid-rows-[auto_1fr]">
      <Navbar onGeojsonImport={setGeojsonData} />
      <HomePage geojsonData={geojsonData} />
    </div>
  )
}

export default App

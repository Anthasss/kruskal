import HomePage from './pages/HomePage'
import Navbar from './components/navigation/Navbar'

import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-full h-screen grid grid-rows-[auto_1fr]">
      <Navbar />
      <HomePage />
    </div>
  )
}

export default App

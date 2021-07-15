import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import Navbar from './Components/Navbar'
import TopInfo from './Components/TopInfo'
import HomeScreen from './Screens/HomeScreen'
import PrayerWallScreen from './Screens/PrayerWallScreen'

library.add(fab)

function App() {
  return (
    <Router>
      <div className='app'>
        <div className='app-header'>
          <TopInfo />
          <div className='container'>
            <Navbar />
          </div>
          <main className='container'>
            <Route path='/' component={HomeScreen} exact />
            <Route path='/prayerwall' component={PrayerWallScreen} />
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App

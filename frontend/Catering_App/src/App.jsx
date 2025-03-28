import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import AboutPage from './Pages/AboutPage'
import Services from './Pages/Services'
import Carrers from './Pages/Carrers'
import { useThemeStore } from './store/useThemeStore'
import Carousel from './Components/Hero'

function App() {
  const {theme} = useThemeStore()

  return (
    <>
    <div data-theme={theme}>
    <Navbar/>
    <Routes>
      <Route path='/' element={<><HomePage/></>} ></Route>
      <Route path='/About' element={<AboutPage/>}></Route>
      <Route path='/Services' element={<Services/>}></Route>
      <Route path='/Carrers' element={<Carrers/>}></Route>
    </Routes>
    </div>
    
    </>
  )
}

export default App

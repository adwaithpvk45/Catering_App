import './App.css'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import AboutPage from './Pages/AboutPage'
import Services from './Pages/Services'
import Carrers from './Pages/Contact'
import { useThemeStore } from './store/useThemeStore'
import { Toaster } from 'react-hot-toast'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import { useLocation } from 'react-router-dom'
import Footer from './Components/Footer'
import FoodPage from './Pages/FoodPage'
import Contact from './Pages/Contact'

function App() {
  const {theme} = useThemeStore()

  // const location = useLocation()

  // const locationPath = location.pathname === "/login" || location.pathname==="/signup"

  return (
    <>
    <div data-theme={theme}>
      <Toaster/>
      {/* {!locationPath && <Navbar/>} */}
      <Navbar/>
    <Routes>
      <Route path='/' element={<><HomePage/></>} ></Route>
      <Route path='/Home' element={<><HomePage/></>} ></Route>
      <Route path='/About' element={<AboutPage/>}></Route>
      <Route path='/Services' element={<Services/>}></Route>
      <Route path='/Contact' element={<Contact/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path='/signup' element={<SignupPage/>}></Route>
      <Route path='/food' element={<FoodPage/>}></Route>
    </Routes>
    <Footer/>
    </div>
    
    </>
  )
}

export default App

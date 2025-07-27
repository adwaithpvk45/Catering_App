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
import AdminDashboard from './Pages/AdminDashboard'
import Dashboard from './Components/Admin/Dashboard'
import Complaints from './Components/Admin/Complaints/Complaints'
import UsersList from './Components/Admin/Users/UserList'
import VendorsList from './Components/Admin/Vendors/VendorList'
import AdminBookings from './Components/Admin/Bookings/Bookings'
import VendorBookings from './Components/Vendor/vendorBookings/VendorBookings'
import VendorMenuItems from './Components/Vendor/VendorMenu/VendorMenuItems'
import VendorServices from './Components/Vendor/VendorServices/VendorServiceList'
import GuestRoute from './routes/GuestRoute'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  const {theme} = useThemeStore()

  const location = useLocation()

  const locationPath = location.pathname === "/login" || location.pathname==="/signup" ||  location.pathname.startsWith("/admin")|| location.pathname.startsWith("/vendor"); 

  return (
    <>
    <div data-theme={theme}>
      <Toaster/>
      {!locationPath && <Navbar/>}
      {/* <Navbar/> */}
   <Routes>
  {/* Public pages */}
  <Route path="/" element={<HomePage />} />
  <Route path="/home" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/services" element={<Services />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/food" element={<FoodPage />} />

  {/* Guest-only routes */}
  <Route element={<GuestRoute/>}>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
  </Route>

  {/* Admin */}
  <Route element={<ProtectedRoute roles={['admin']} />}>
    <Route path="/admin" element={<AdminDashboard />}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="bookings" element={<AdminBookings />} />
      <Route path="complaints" element={<Complaints />} />
      <Route path="vendors" element={<VendorsList />} />
      <Route path="users" element={<UsersList />} />
    </Route>
  </Route>

  {/* Vendor */}
  <Route element={<ProtectedRoute roles={['vendor']} />}>
    <Route path="/vendor" element={<AdminDashboard />}>
      <Route index element={<Dashboard />} />
      <Route path="vendorDashboard" element={<Dashboard />} />
      <Route path="vendorBookings" element={<VendorBookings />} />
      <Route path="vendorServices" element={<VendorServices />} />
      <Route path="vendorMenu" element={<VendorMenuItems />} />
      <Route path="users" element={<UsersList />} />
    </Route>
  </Route>
</Routes>
    {!locationPath && <Footer/>}
    </div>
    
    </>
  )
}

export default App

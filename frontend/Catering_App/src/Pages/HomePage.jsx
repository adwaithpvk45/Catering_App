import React from 'react'
import Carousel from '../Components/Hero'
import AboutUs from '../Components/AboutUs'
import Customer from '../Components/Customer'
import Menu from '../Components/Menu'
import Services from '../Components/Services'
import Footer from '../Components/Footer'

function HomePage() {
  return (
    <>
    <Carousel/>
    <AboutUs/>
    <Customer/>
    <Menu/>
    <Services/>
    </>
  )
}

export default HomePage
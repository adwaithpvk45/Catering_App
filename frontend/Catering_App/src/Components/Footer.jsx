import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6  flex-col items-center">
    <div className="container mx-auto flex flex-col justify-between items-center gap-10">
      
      {/* Logo and Tagline */}
      <div className="text-center ">
        <h2 className="text-3xl font-bold text-yellow-400 pb-10">Feastify</h2>
        <p className="text-sm mt-1 text-gray-400">
          Bringing flavors to your celebrations!
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 ">
        <a href="#" className="hover:text-yellow-400 transition">Home</a>
        <a href="#" className="hover:text-yellow-400 transition">Services</a>
        <a href="#" className="hover:text-yellow-400 transition">About</a>
        <a href="#" className="hover:text-yellow-400 transition">Contact</a>
      </div>

      {/* Social Media Links */}
      <div className="flex gap-4 mt-4 ">
        <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
          <FaFacebookF size={20} />
        </a>
        <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
          <FaInstagram size={20} />
        </a>
        <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
          <FaTwitter size={20} />
        </a>
      </div>
    </div>

    {/* Copyright Section */}
    <div className="text-center text-gray-500 text-sm mt-6">
      © {new Date().getFullYear()} Feastify. All rights reserved.
    </div>
  </footer>  )
}

export default Footer
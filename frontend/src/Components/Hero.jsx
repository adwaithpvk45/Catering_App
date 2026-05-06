import React from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { Search, Utensils, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-neutral-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop" 
          alt="Catering Background" 
          className="w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-base-100"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
            Elevate Your Event with <br />
            <span className="text-[#FF7D44]">
              <Typewriter
                options={{
                  strings: ['Premium Catering', 'Exquisite Flavors', 'Unforgettable Moments', 'Professional Chefs'],
                  autoStart: true,
                  loop: true,
                  delay: 75,
                }}
              />
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 font-medium">
            From intimate gatherings to grand celebrations, we connect you with the finest caterers in the city.
          </p>
        </motion.div>

        {/* Search Bar / Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto bg-base-100/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/10 flex flex-col md:flex-row items-center gap-4"
        >
          <div className="flex-1 flex items-center gap-3 px-4 w-full border-b md:border-b-0 md:border-r border-base-content/10 py-2">
            <Search className="text-[#FF7D44] size-5 shrink-0" />
            <input 
              type="text" 
              placeholder="Search cuisines (e.g. Italian, Indian)" 
              className="bg-transparent border-none outline-none w-full font-bold text-base-content"
            />
          </div>
          
          <div className="flex-1 flex items-center gap-3 px-4 w-full border-b md:border-b-0 md:border-r border-base-content/10 py-2">
            <MapPin className="text-[#FF7D44] size-5 shrink-0" />
            <input 
              type="text" 
              placeholder="Your Location" 
              className="bg-transparent border-none outline-none w-full font-bold text-base-content"
            />
          </div>

          <Link to="/food" className="w-full md:w-auto">
            <button className="btn btn-warning text-white px-8 h-14 rounded-2xl w-full md:w-auto font-black tracking-tight shadow-lg shadow-orange-500/20 hover:scale-105 transition-all">
              Find Food
            </button>
          </Link>
        </motion.div>

        {/* Floating Badges */}
        <div className="hidden lg:block">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white flex items-center gap-3"
          >
            <div className="size-10 rounded-full bg-[#FF7D44] flex items-center justify-center">
              <Utensils className="size-5" />
            </div>
            <div className="text-left">
              <div className="text-xs opacity-60">Verified</div>
              <div className="font-bold">500+ Caterers</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-40 right-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white flex items-center gap-3"
          >
            <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Calendar className="size-5" />
            </div>
            <div className="text-left">
              <div className="text-xs opacity-60">Success</div>
              <div className="font-bold">10k+ Events</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
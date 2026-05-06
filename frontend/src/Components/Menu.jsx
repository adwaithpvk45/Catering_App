import React from 'react';
import cateringServices from '../store/data';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const CuisineCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative bg-base-100 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-content/5"
  >
    {/* Image Container */}
    <div className="relative h-64 overflow-hidden">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Popular Badge */}
      {index === 0 && (
        <div className="absolute top-4 left-4 bg-[#FF7D44] text-white px-4 py-1 rounded-full text-xs font-black tracking-widest shadow-lg flex items-center gap-1">
          <Star className="size-3 fill-white" />
          POPULAR
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-8">
      <h3 className="text-2xl font-black mb-3 group-hover:text-[#FF7D44] transition-colors duration-300">
        {item.title}
      </h3>
      <p className="text-base-content/60 font-medium mb-6 line-clamp-2">
        {item.description}
      </p>
      
      <div className="flex items-center justify-between">
        <Link to="/food" className="flex items-center gap-2 font-black text-[#FF7D44] group/link">
          Explore Menu
          <ArrowRight className="size-5 group-hover/link:translate-x-2 transition-transform" />
        </Link>
        <div className="size-10 rounded-full bg-base-200 flex items-center justify-center text-base-content/20 group-hover:bg-[#FF7D44]/10 group-hover:text-[#FF7D44] transition-colors">
          <Star className="size-5" />
        </div>
      </div>
    </div>
  </motion.div>
);

function Menu() {
  return (
    <section className="py-24 bg-base-200 transition-colors duration-300">
      <div className="container mx-auto px-6 sm:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#FF7D44] font-black tracking-widest text-sm uppercase mb-4 block">Taste the World</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Signature <span className="text-[#FF7D44]">Cuisines.</span>
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-lg text-base-content/60 font-medium max-w-md md:text-right"
          >
            From the spicy streets of North India to the traditional feasts of the South, we bring the world's best flavors to your plate.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cateringServices.map((item, index) => (
            <CuisineCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Bottom Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <Link to="/food">
            <button className="btn btn-warning text-white px-12 h-16 rounded-2xl font-black text-lg tracking-tight shadow-xl shadow-orange-500/20 hover:scale-105 transition-all group">
              View All Cuisines
              <ArrowRight className="size-6 group-hover:translate-x-2 transition-transform ml-2" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Menu;
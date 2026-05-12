import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Clock, MapPin, ArrowRight, X } from 'lucide-react';
import cateringServices from '../store/data';

const categories = ["All", "Indian", "North Indian", "South Indian", "Continental", "Asian"];

const FoodCard = ({ item, index }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className="group bg-base-100 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-content/5 flex flex-col h-full"
  >
    <div className="relative h-64 overflow-hidden">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {item.popular && (
          <div className="bg-[#FF7D44] text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg flex items-center gap-1 w-fit">
            <Star className="size-3 fill-white" />
            POPULAR
          </div>
        )}
        <div className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-white/20 w-fit">
          {item.category.toUpperCase()}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
        <MapPin className="size-4 text-[#FF7D44]" />
        <span className="text-xs font-bold">Premium Venues</span>
      </div>
    </div>

    <div className="p-8 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-black tracking-tight group-hover:text-[#FF7D44] transition-colors duration-300">
          {item.title}
        </h3>
        <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-lg">
          <Star className="size-3 fill-success" />
          <span className="text-xs font-black">{item.rating}</span>
        </div>
      </div>
      
      <p className="text-base-content/60 font-medium mb-8 line-clamp-2 text-sm leading-relaxed">
        {item.description}
      </p>
      
      <div className="mt-auto flex items-center justify-between pt-6 border-t border-base-content/5">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Price Range</span>
          <span className="text-[#FF7D44] font-black tracking-tighter text-lg">{item.priceRange}</span>
        </div>
        
        <button className="btn btn-warning btn-circle text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
          <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  </motion.div>
);

function FoodPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = useMemo(() => {
    return cateringServices.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-base-100 min-h-screen pt-24 pb-24 transition-colors duration-300">
      <div className="container mx-auto px-6 sm:px-12">
        
        {/* Header Section */}
        <div className="text-center mb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#FF7D44] font-black tracking-widest text-sm uppercase mb-4 block">Taste the world</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
              Explore Our <br />
              <span className="text-[#FF7D44]">Exquisite Menus</span>
            </h1>
            <p className="text-xl text-base-content/60 max-w-2xl mx-auto font-medium">
              Discover a world of flavors tailored for your special moments. From traditional feasts to modern fusions.
            </p>
          </motion.div>

          {/* Decorative element */}
          <div className="absolute top-0 right-0 size-64 bg-[#FF7D44]/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
        </div>

        {/* Search and Filters Bar */}
        <div className="max-w-6xl mx-auto mb-16 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-[#FF7D44] transition-colors" />
              <input 
                type="text" 
                placeholder="Search for cuisines or caterers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-base-200 h-16 rounded-[1.5rem] pl-16 pr-6 outline-none font-bold text-lg border-2 border-transparent focus:border-[#FF7D44]/30 focus:bg-base-100 transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-6 top-1/2 -translate-y-1/2 hover:text-[#FF7D44]"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>

            {/* Category Pills (Desktop) */}
            <div className="hidden lg:flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 h-16 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                    selectedCategory === cat 
                    ? "bg-[#FF7D44] text-white shadow-xl shadow-orange-500/20" 
                    : "bg-base-200 text-base-content/60 hover:bg-base-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills (Mobile) */}
          <div className="flex lg:hidden gap-3 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                  ? "bg-[#FF7D44] text-white" 
                  : "bg-base-200 text-base-content/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 px-2">
          <p className="font-bold text-base-content/40 uppercase tracking-widest text-xs">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
          </p>
          <div className="flex items-center gap-2 text-xs font-black text-[#FF7D44] uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity">
            <Filter className="size-4" />
            Sort by: Popular
          </div>
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item, index) => (
              <FoodCard key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center"
          >
            <div className="size-24 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-8 text-base-content/20">
              <Search className="size-10" />
            </div>
            <h3 className="text-3xl font-black mb-4">No results found</h3>
            <p className="text-base-content/60 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
              className="btn btn-warning text-white mt-10 px-8 rounded-xl font-bold"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default FoodPage;
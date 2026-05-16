import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  UtensilsCrossed,
  Calendar
} from 'lucide-react';
import cateringServices from '../store/data';

function ServiceDetailPage() {
  const { id } = useParams();
  
  const service = useMemo(() => {
    return cateringServices.find(item => item.id === parseInt(id));
  }, [id]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
        <h2 className="text-3xl font-black mb-4">Service Not Found</h2>
        <Link to="/food" className="btn btn-warning text-white font-bold px-8">
          Back to Cuisines
        </Link>
      </div>
    );
  }

  const menuHighlights = [
    { name: "Signature Starter", description: "Chef's special appetizer featuring local spices." },
    { name: "Premium Main Course", description: "Slow-cooked to perfection with artisanal ingredients." },
    { name: "Artisanal Dessert", description: "A sweet conclusion with a modern twist." },
    { name: "Refreshment Blend", description: "Signature mocktail or house-made beverage." }
  ];

  return (
    <div className="bg-base-100 min-h-screen pb-24 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={service.image} 
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-6 pb-12 sm:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link 
              to="/food" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 font-black text-xs uppercase tracking-widest bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all"
            >
              <ArrowLeft className="size-4" />
              Back to Explore
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-[#FF7D44] text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg">
                {service.category.toUpperCase()}
              </span>
              {service.popular && (
                <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-white/20">
                  TOP RATED
                </span>
              )}
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-4 leading-none drop-shadow-2xl">
              {service.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 sm:px-12 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-base-200/50 backdrop-blur-xl border border-base-content/5 rounded-[3rem] p-8 md:p-12 shadow-xl mb-12"
            >
              <div className="flex flex-wrap items-center gap-8 mb-12 py-6 border-b border-base-content/5">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-[#FF7D44]/10 flex items-center justify-center text-[#FF7D44]">
                    <Star className="size-6 fill-[#FF7D44]" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest opacity-40">Rating</div>
                    <div className="text-xl font-black">{service.rating} / 5.0</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest opacity-40">Verified</div>
                    <div className="text-xl font-black">Safety First</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-warning/10 flex items-center justify-center text-warning">
                    <Clock className="size-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest opacity-40">Min. Prep</div>
                    <div className="text-xl font-black">48 Hours</div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <ShieldCheck className="text-[#FF7D44]" />
                Service Inclusions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {service.includedServices?.map((feat, i) => (
                  <div key={i} className="flex items-start gap-4 bg-base-100 p-6 rounded-[2rem] border border-base-content/5 hover:border-[#FF7D44]/20 transition-all group">
                    <div className="size-10 rounded-xl bg-success/10 flex items-center justify-center text-success shrink-0 group-hover:bg-success group-hover:text-white transition-colors">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-1">{feat.title}</h4>
                      <p className="text-sm text-base-content/60 font-medium">{feat.description}</p>
                    </div>
                  </div>
                )) || (
                  ['Customizable Menu', 'Professional Servers', 'Premium Cutlery', 'Full Setup & Cleanup'].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 bg-base-100 p-4 rounded-2xl border border-base-content/5">
                      <CheckCircle2 className="text-success size-5" />
                      <span className="font-bold">{feat}</span>
                    </div>
                  ))
                )}
              </div>

              <h2 className="text-3xl font-black mb-10 flex items-center gap-3">
                <UtensilsCrossed className="text-[#FF7D44]" />
                The Full Menu
              </h2>
              
              <div className="space-y-12">
                {service.fullMenu && Object.entries(service.fullMenu).map(([category, items], idx) => (
                  <div key={category} className="relative">
                    <h3 className="text-xl font-black uppercase tracking-[0.2em] text-[#FF7D44] mb-8 flex items-center gap-4">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                      <div className="h-[2px] flex-grow bg-[#FF7D44]/10 rounded-full"></div>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {items.map((item, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className="group relative pl-6 border-l-2 border-base-content/5 hover:border-[#FF7D44] transition-colors"
                        >
                          <h4 className="font-black text-xl mb-2 group-hover:text-[#FF7D44] transition-colors">{item.name}</h4>
                          <p className="text-sm text-base-content/60 font-medium leading-relaxed">{item.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}

                {!service.fullMenu && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {menuHighlights.map((item, i) => (
                      <div key={i} className="group p-6 rounded-[2rem] bg-base-100 border border-base-content/5 hover:border-[#FF7D44]/30 transition-all duration-300">
                        <div className="size-10 rounded-xl bg-base-200 flex items-center justify-center mb-4 text-[#FF7D44] group-hover:bg-[#FF7D44] group-hover:text-white transition-colors">
                          <UtensilsCrossed className="size-5" />
                        </div>
                        <h4 className="font-black text-xl mb-2">{item.name}</h4>
                        <p className="text-sm text-base-content/60 font-medium">{item.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="sticky top-24 bg-base-100 rounded-[3rem] p-8 border border-base-content/10 shadow-2xl overflow-hidden"
            >
              {/* Decorative background circle */}
              <div className="absolute top-0 right-0 size-32 bg-[#FF7D44]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

              <div className="relative">
                {/* Vendor Info Section */}
                <div className="mb-10 p-5 rounded-[2rem] bg-base-200/50 border border-base-content/5">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 ml-1">Service Provider</div>
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl overflow-hidden shadow-md ring-2 ring-[#FF7D44]/20">
                      <img src={service.vendor.image} alt={service.vendor.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg leading-tight mb-1 flex items-center gap-2">
                        {service.vendor.name}
                        <CheckCircle2 className="size-4 text-info" />
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-0.5 rounded-lg">
                          <Star className="size-3 fill-success" />
                          <span className="text-[10px] font-black">{service.vendor.rating}</span>
                        </div>
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">({service.vendor.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">Starting from</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter text-[#FF7D44]">{service.priceRange}</span>
                    <span className="text-sm font-bold opacity-60">/ person</span>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Number of Guests</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                      <input 
                        type="number" 
                        placeholder="Min. 20 guests" 
                        className="w-full bg-base-200 h-14 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 border-transparent focus:border-[#FF7D44]/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Event Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                      <input 
                        type="date" 
                        className="w-full bg-base-200 h-14 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 border-transparent focus:border-[#FF7D44]/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full btn btn-warning h-16 rounded-2xl text-white font-black text-lg shadow-xl shadow-orange-500/20 group">
                  Proceed to Booking
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 text-center">
                  <p className="text-xs font-medium text-base-content/40">
                    No payment required yet. Our team will contact you to finalize the menu details.
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-base-content/5 flex items-center justify-center gap-6">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="size-8 rounded-full border-2 border-base-100 bg-base-300 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">12+ People booked today</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceDetailPage;

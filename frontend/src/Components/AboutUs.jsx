import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, Zap, Clock } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ x: 10 }}
    className="flex gap-4 p-4 rounded-2xl hover:bg-base-200 transition-colors duration-300"
  >
    <div className="size-12 rounded-xl bg-[#FF7D44]/10 flex items-center justify-center text-[#FF7D44] shrink-0">
      <Icon className="size-6" />
    </div>
    <div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-base-content/60 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

function AboutUs() {
  return (
    <section className="py-24 bg-base-100 overflow-hidden">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side: Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-base-200">
              <img 
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1974&auto=format&fit=crop" 
                alt="Chef Cooking" 
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 size-40 bg-[#FF7D44]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 size-60 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            {/* Floating Info Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 md:right-10 bg-base-100 p-6 rounded-3xl shadow-2xl border border-base-content/5 z-20"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-success/20 flex items-center justify-center text-success">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <div className="font-black text-xl">100% Quality</div>
                  <div className="text-xs font-bold opacity-40 uppercase tracking-widest">Verified Caterers</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <span className="text-[#FF7D44] font-black tracking-widest text-sm uppercase mb-4 block">Our Difference</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                A Culinary Experience <br />
                <span className="text-[#FF7D44]">Like No Other</span>
              </h2>
              <p className="text-lg text-base-content/70 font-medium leading-relaxed">
                We believe that food is the heart of every great gathering. Feastify bridges the gap between professional chefs and food lovers, ensuring your event is unforgettable.
              </p>
            </div>

            <div className="space-y-2 mb-10">
              <FeatureItem 
                icon={Star}
                title="Top-Rated Professionals"
                description="Only the best caterers make it onto our platform. Every chef is vetted for quality and hygiene."
              />
              <FeatureItem 
                icon={Zap}
                title="Instant Customization"
                description="Easily tailor menus to your guests' dietary needs and preferences with a few clicks."
              />
              <FeatureItem 
                icon={Clock}
                title="Reliable Delivery"
                description="We track every order to ensure your feast arrives exactly when you need it, fresh and hot."
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/about">
                <button className="btn btn-warning text-white px-10 h-14 rounded-2xl font-black tracking-tight shadow-lg shadow-orange-500/20 hover:scale-105 transition-all">
                  Learn Our Story
                </button>
              </Link>
              <Link to="/contact">
                <button className="btn btn-ghost px-8 h-14 rounded-2xl font-bold hover:bg-base-200">
                  Get in Touch
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
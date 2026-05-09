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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-24 bg-base-100 overflow-hidden">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side: Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-base-200">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1974&auto=format&fit=crop" 
                alt="Chef Cooking" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 size-40 bg-[#FF7D44]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 size-60 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            {/* Floating Info Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 md:right-10 bg-base-100 p-8 rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-base-content/5 z-20"
            >
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-success/10 flex items-center justify-center text-success shadow-inner">
                  <ShieldCheck className="size-7" />
                </div>
                <div>
                  <div className="font-black text-2xl tracking-tighter">100% Quality</div>
                  <div className="text-xs font-black opacity-40 uppercase tracking-widest">Verified Caterers</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="mb-10">
              <span className="text-[#FF7D44] font-black tracking-widest text-sm uppercase mb-4 block">Our Difference</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
                A Culinary Experience <br />
                <span className="text-[#FF7D44]">Like No Other</span>
              </h2>
              <p className="text-xl text-base-content/60 font-medium leading-relaxed max-w-xl">
                We believe that food is the heart of every great gathering. Feastify bridges the gap between professional chefs and food lovers, ensuring your event is unforgettable.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-4 mb-12">
              <motion.div variants={itemVariants}>
                <FeatureItem 
                  icon={Star}
                  title="Top-Rated Professionals"
                  description="Only the best caterers make it onto our platform. Every chef is vetted for quality and hygiene."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureItem 
                  icon={Zap}
                  title="Instant Customization"
                  description="Easily tailor menus to your guests' dietary needs and preferences with a few clicks."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureItem 
                  icon={Clock}
                  title="Reliable Delivery"
                  description="We track every order to ensure your feast arrives exactly when you need it, fresh and hot."
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
              <Link to="/about">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-warning text-white px-10 h-16 rounded-[1.5rem] font-black tracking-tight shadow-xl shadow-orange-500/30 hover:bg-[#ff8e5a] border-none"
                >
                  Learn Our Story
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-ghost px-10 h-16 rounded-[1.5rem] font-black tracking-tight hover:bg-base-200"
                >
                  Get in Touch
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>

  );
}

export default AboutUs;
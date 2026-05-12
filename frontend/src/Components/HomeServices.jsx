import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Cake, Briefcase, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: "Wedding Catering",
    description: "Elegant menus for your most special day, from grand ballrooms to intimate gardens.",
    icon: <Heart className="size-6" />,
    color: "bg-pink-500/10 text-pink-500",
    link: "/services"
  },
  {
    title: "Birthday Parties",
    description: "Flavor and fun for every age. Custom cakes and menus that make every birthday legendary.",
    icon: <Cake className="size-6" />,
    color: "bg-orange-500/10 text-[#FF7D44]",
    link: "/services"
  },
  {
    title: "Corporate Events",
    description: "Professional catering that impresses clients and energizes teams for every business need.",
    icon: <Briefcase className="size-6" />,
    color: "bg-blue-500/10 text-blue-500",
    link: "/services"
  },
  {
    title: "Home Gatherings",
    description: "Quality time with family while we handle the kitchen. Fresh, delicious joy delivered home.",
    icon: <Home className="size-6" />,
    color: "bg-emerald-500/10 text-emerald-500",
    link: "/services"
  }
];

const ServiceCard = ({ service, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group p-8 rounded-[2.5rem] bg-base-100 border border-base-content/5 hover:border-[#FF7D44]/30 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500"
  >
    <div className={`size-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
      {service.icon}
    </div>
    <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-[#FF7D44] transition-colors">
      {service.title}
    </h3>
    <p className="text-base-content/60 font-medium mb-8 leading-relaxed">
      {service.description}
    </p>
    <Link 
      to={service.link}
      className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-[#FF7D44] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
    >
      Learn More <ArrowRight className="size-4" />
    </Link>
  </motion.div>
);

function HomeServices() {
  return (
    <section className="py-24 bg-base-200/50 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/4 size-96 bg-[#FF7D44]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-[#FF7D44] font-black tracking-widest text-sm uppercase mb-4 block">Our Expertise</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Catering for Every <br />
              <span className="text-[#FF7D44]">Occasion.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start md:items-end gap-4"
          >
            <p className="text-lg text-base-content/60 font-medium md:text-right max-w-xs">
              We specialize in turning gatherings into memories with exceptional food and service.
            </p>
            <Link to="/services">
              <button className="btn btn-ghost font-black tracking-tight group">
                View All Services 
                <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeServices;

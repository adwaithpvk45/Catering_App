import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Cake, 
  Briefcase, 
  Home, 
  GraduationCap, 
  Music, 
  UtensilsCrossed,
  ArrowRight,
  Search,
  CheckCircle,
  Truck
} from 'lucide-react';

const serviceList = [
  {
    title: "Wedding Catering",
    description: "From elegant grand ballrooms to intimate garden ceremonies, we create menus that celebrate your love story.",
    icon: <Heart className="size-6" />,
    image: "/wedding_service.png"
  },
  {
    title: "Birthday Parties",
    description: "Whether it's a first birthday or a milestone 50th, we bring the flavor and fun to every celebration.",
    icon: <Cake className="size-6" />,
    image: "/birthday_service.png"
  },
  {
    title: "Corporate Events",
    description: "Impress your clients and energize your team with professional, high-quality catering for every business need.",
    icon: <Briefcase className="size-6" />,
    image: "/graduation_service.png"
  },
  {
    title: "Home Gatherings",
    description: "Hosting at home? Let us handle the kitchen so you can spend quality time with your family and friends.",
    icon: <Home className="size-6" />,
    image: "/housewarming_service.png"
  },
  {
    title: "Graduation Party",
    description: "Celebrate the achievement with a feast! We provide diverse menus that appeal to graduates and guests alike.",
    icon: <GraduationCap className="size-6" />,
    image: "/graduation_service.png"
  },
  {
    title: "Social Events",
    description: "From anniversaries to reunions, we provide the perfect culinary backdrop for all of life's special social moments.",
    icon: <Music className="size-6" />,
    image: "/anniversary_service.png"
  }
];

const WorkflowStep = ({ icon: Icon, title, description, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="flex flex-col items-center text-center p-6"
  >
    <div className="size-16 rounded-2xl bg-base-200 flex items-center justify-center text-[#FF7D44] mb-4 shadow-sm group-hover:bg-[#FF7D44] group-hover:text-white transition-colors">
      <Icon className="size-8" />
    </div>
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-sm text-base-content/60">{description}</p>
  </motion.div>
);

function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="bg-base-100 min-h-screen py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span 
              initial={{ letterSpacing: "0.2em", opacity: 0 }}
              animate={{ letterSpacing: "0.1em", opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[#FF7D44] font-black tracking-widest text-sm uppercase mb-4 block"
            >
              What we offer
            </motion.span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
              Tailored <span className="text-[#FF7D44]">Catering</span> <br className="hidden md:block" /> Solutions
            </h1>
            <p className="text-xl text-base-content/60 max-w-3xl mx-auto font-medium leading-relaxed">
              We provide high-end catering services for every occasion, ensuring that every plate tells a story of quality and passion.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {serviceList.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -15 }}
              className="relative group h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl cursor-pointer bg-neutral-900"
            >
              {/* Background Image with Zoom */}
              <motion.img 
                src={service.image} 
                alt={service.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />
              
              {/* Animated Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:bg-[#FF7D44]/40 transition-all duration-700"
              ></div>

              <div className="relative flex flex-col h-full p-12 text-white z-10">
                <motion.div 
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1,
                    boxShadow: "0px 0px 20px rgba(255, 125, 68, 0.5)"
                  }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="flex items-center justify-center size-16 rounded-2xl mb-8 bg-[#FF7D44] text-white shadow-xl transition-all duration-500"
                >
                  {service.icon}
                </motion.div>

                <div className="mt-auto">
                  <motion.h3 
                    className="text-4xl font-black mb-4 tracking-tighter"
                  >
                    {service.title}
                  </motion.h3>
                  <p className="text-lg font-medium leading-relaxed text-white/70 group-hover:text-white transition-colors duration-500 line-clamp-3">
                    {service.description}
                  </p>
                  
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="mt-10 flex items-center gap-3 group/btn"
                  >
                    <div className="h-[2px] w-8 bg-[#FF7D44] group-hover/btn:w-12 transition-all duration-300"></div>
                    <span className="font-black tracking-widest text-xs uppercase">Discovery</span>
                    <ArrowRight className="size-5 text-[#FF7D44] group-hover/btn:translate-x-1 transition-transform" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Workflow Section */}
        <div className="mt-40 pt-24 border-t border-base-content/5 relative">
          {/* Subtle background text */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
            <span className="text-[15vw] font-black uppercase whitespace-nowrap">Process</span>
          </div>

          <div className="text-center mb-24">
            <motion.h3 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Our Seamless <span className="text-[#FF7D44]">Workflow</span>
            </motion.h3>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-2 bg-[#FF7D44] mx-auto rounded-full"
            ></motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            <WorkflowStep 
              index={0}
              icon={Search}
              title="Browse & Select"
              description="Explore our curated list of expert caterers."
            />
            <WorkflowStep 
              index={1}
              icon={UtensilsCrossed}
              title="Customize Menu"
              description="Tailor every dish to your event's theme."
            />
            <WorkflowStep 
              index={2}
              icon={CheckCircle}
              title="Confirm Order"
              description="Secure your date with easy online booking."
            />
            <WorkflowStep 
              index={3}
              icon={Truck}
              title="Enjoy the Feast"
              description="We deliver fresh and delicious joy to you."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;




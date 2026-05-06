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
  return (
    <div className="bg-base-100 min-h-screen py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#FF7D44] font-black tracking-widest text-sm uppercase mb-4 block">What we offer</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Tailored <span className="text-[#FF7D44]">Catering</span> Solutions
            </h1>
            <p className="text-xl text-base-content/60 max-w-3xl mx-auto font-medium leading-relaxed">
              We provide high-end catering services for every occasion, ensuring that every plate tells a story of quality and passion.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group h-[450px] rounded-[3rem] overflow-hidden shadow-2xl cursor-pointer"
            >
              {/* Background Image */}
              <img 
                src={service.image} 
                alt={service.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black/50 group-hover:bg-[#FF7D44]/90 transition-all duration-500"
              ></div>

              <div className="relative flex flex-col h-full p-10 text-white">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center size-14 rounded-2xl mb-6 bg-[#FF7D44] text-white group-hover:bg-white group-hover:text-[#FF7D44] shadow-lg transition-colors duration-500"
                >
                  {service.icon}
                </motion.div>

                <div className="mt-auto">
                  <h3 className="text-3xl font-black mb-4 group-hover:translate-x-2 transition-transform duration-300">
                    {service.title}
                  </h3>
                  <p className="text-base font-medium leading-relaxed text-white/80 group-hover:text-white transition-colors duration-500">
                    {service.description}
                  </p>
                  
                  <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="font-black tracking-tighter">VIEW DETAILS</span>
                    <ArrowRight className="size-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workflow Section */}
        <div className="mt-32 pt-20 border-t border-base-content/5">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black mb-4">Our Seamless <span className="text-[#FF7D44]">Workflow</span></h3>
            <div className="h-1.5 w-20 bg-[#FF7D44] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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



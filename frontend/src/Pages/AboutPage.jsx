import React, { useEffect, useRef, useState } from 'react';
import { 
  Users, 
  Target, 
  Award, 
  ChefHat, 
  CheckCircle, 
  Heart 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView, animate } from 'framer-motion';

const AnimatedCounter = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      // Extract the numeric part (e.g., "10000" from "10,000+")
      const numericValue = parseInt(value.replace(/,/g, '').replace(/\+/g, ''));
      
      const controls = animate(0, numericValue, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          setDisplayValue(Math.round(value));
        }
      });

      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black mb-2 transition-all">
        {displayValue.toLocaleString()}{value.includes('+') ? '+' : ''}
      </div>
      <div className="text-sm uppercase tracking-widest opacity-90">{label}</div>
    </div>
  );
};

const stats = [
  { label: 'Successful Events', value: '10,000+' },
  { label: 'Partner Caterers', value: '500+' },
  { label: 'Happy Customers', value: '25,000+' },
  { label: 'Cities Covered', value: '50+' },
];

const values = [
  {
    title: "Quality First",
    description: "We only partner with caterers who meet our rigorous standards for taste, hygiene, and presentation.",
    icon: <ChefHat className="size-6" />,
  },
  {
    title: "Customer Obsessed",
    description: "Your event's success is our priority. Our support team is here to ensure every detail is perfect.",
    icon: <Heart className="size-6" />,
  },
  {
    title: "Reliability",
    description: "No more last-minute cancellations. We guarantee your food arrives fresh and on time, every time.",
    icon: <Award className="size-6" />,
  }
];

function AboutPage() {
  return (
    <div className="bg-base-100 text-base-content min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-6"
          >
            Our Mission is to <span className="text-[#FF7D44]">Feed Your Dreams</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-base-content/70 max-w-3xl mx-auto"
          >
            Feastify was born out of a simple idea: that finding the perfect caterer for your special occasion should be as enjoyable as the meal itself.
          </motion.p>
        </div>
      </section>

      {/* Our Story / Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img 
                src="/wedding_service.png" 
                alt="Our Story" 
                className="rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#FF7D44] p-8 rounded-3xl hidden lg:block shadow-xl">
                <Target className="text-white size-12" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Users className="text-[#FF7D44]" />
                Our Story
              </h2>
              <p className="text-lg text-base-content/80 mb-6 leading-relaxed">
                Founded in 2024, Feastify started as a small local directory and has grown into the leading platform for event catering. We realized that event planning is stressful, and food is the heart of every gathering.
              </p>
              <p className="text-lg text-base-content/80 mb-8 leading-relaxed">
                We've built a bridge between the most talented chefs and people who want to celebrate life's moments. Our platform ensures transparency, quality, and most importantly, delicious experiences.
              </p>
              <div className="space-y-4">
                {['Direct Vendor Communication', 'Secure Payment System', 'Verified Reviews'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 font-semibold text-[#FF7D44]">
                    <CheckCircle className="size-5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#FF7D44] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <AnimatedCounter key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Defines Us</h2>
            <div className="h-1.5 w-20 bg-[#FF7D44] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-3xl border border-base-content/10 hover:border-[#FF7D44]/50 transition-all group"
              >
                <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-base-200 text-[#FF7D44] mb-6 group-hover:bg-[#FF7D44] group-hover:text-white transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-base-content/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black mb-8">Ready to make your next event <span className="text-[#FF7D44]">Unforgettable?</span></h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services" className="btn btn-warning px-8 rounded-xl text-lg font-bold">
              Explore Services
            </Link>
            <Link to="/contact" className="btn btn-outline px-8 rounded-xl text-lg font-bold">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;

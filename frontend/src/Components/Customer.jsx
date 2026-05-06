import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Wedding Planner",
    content: "Feastify has completely changed how I source caterers for my clients. The quality and variety are unmatched!",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "Michael Chen",
    role: "Corporate Lead",
    content: "Our annual gala was a huge success thanks to the incredible team we found here. The food was the talk of the night.",
    image: "https://i.pravatar.cc/150?u=michael"
  },
  {
    name: "Elena Rodriguez",
    role: "Birthday Host",
    content: "Simple, fast, and delicious. Being able to customize the menu for my daughter's birthday was a lifesaver!",
    image: "https://i.pravatar.cc/150?u=elena"
  }
];

function Customer() {
  return (
    <section className="py-24 bg-base-100 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 size-96 bg-[#FF7D44]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 sm:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#FF7D44] font-black tracking-widest text-sm uppercase mb-4 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              What Our <span className="text-[#FF7D44]">Happy Customers</span> Say
            </h2>
            <div className="h-1.5 w-20 bg-[#FF7D44] mx-auto rounded-full"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-base-200 p-8 rounded-[2rem] relative group hover:bg-base-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 border border-base-content/5"
            >
              <div className="absolute -top-4 -left-4 size-12 rounded-2xl bg-[#FF7D44] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                <Quote className="size-6 fill-white" />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-5 fill-[#FF7D44] text-[#FF7D44]" />
                ))}
              </div>

              <p className="text-lg text-base-content/80 font-medium italic mb-8 leading-relaxed">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-base-content/5 pt-6">
                <div className="size-12 rounded-2xl overflow-hidden shadow-md">
                  <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-base-content">{review.name}</h4>
                  <p className="text-xs font-bold text-[#FF7D44] uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Customer;
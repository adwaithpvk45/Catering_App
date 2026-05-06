import React from 'react';
import { 
  Heart, 
  Cake, 
  Briefcase, 
  Home, 
  GraduationCap, 
  Music, 
  UtensilsCrossed 
} from 'lucide-react';

const serviceList = [
  {
    title: "Wedding Catering",
    description: "Once you decide to proceed with a wedding project, we offer a simple and convenient way to get in touch with us.",
    icon: <Heart className="size-6" />,
    image: "/wedding_service.png"
  },
  {
    title: "Birthday Parties",
    description: "Our goal is not just to provide a quick fix but to address the underlying issue to prevent future problems.",
    icon: <Cake className="size-6" />,
    image: "/birthday_service.png"
  },
  {
    title: "Corporate Events",
    description: "They will discuss any available options, provide accurate cost estimates, and answer any questions you may have.",
    icon: <Briefcase className="size-6" />,
    image: "/graduation_service.png"
  },
  {
    title: "Home Maintenance",
    description: "They will listen to your concerns, conduct thorough inspections, and identify any areas that may require attention.",
    icon: <Home className="size-6" />,
    image: "/housewarming_service.png"
  },
  {
    title: "Graduation Party",
    description: "They will listen to your concerns, conduct thorough inspections, and identify any areas that may require attention.",
    icon: <GraduationCap className="size-6" />,
    image: "/graduation_service.png"
  },
  {
    title: "Social Events",
    description: "We will provide you with a detailed explanation of the recommended wood or flooring services.",
    icon: <Music className="size-6" />,
    image: "/anniversary_service.png"
  }
];

function Services() {
  return (
    <div className="bg-base-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-base-content tracking-tight sm:text-5xl">
            Our Services
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((service, index) => (
            <div
              key={index}
              style={{ 
                backgroundImage: `url(${service.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              className="relative group h-[400px] rounded-[2rem] overflow-hidden transition-all duration-500 transform hover:-translate-y-2 shadow-lg cursor-pointer"
            >
              {/* Dynamic Overlay: Switches from Black to Orange on Hover */}
              <div 
                className="absolute inset-0 bg-black/60 group-hover:bg-[#FF7D44]/90 transition-all duration-500"
              ></div>

              <div className="relative flex flex-col h-full p-8 text-white">
                {/* Dynamic Icon Circle: Inverts colors on Hover */}
                <div 
                  className="flex items-center justify-center size-12 rounded-full mb-6 bg-[#FF7D44] text-white group-hover:bg-white group-hover:text-[#FF7D44] transition-all duration-500"
                >
                  {service.icon}
                </div>

                {/* Content Container (Pushed to bottom) */}
                <div className="mt-auto">
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-200 group-hover:text-white/95 transition-colors duration-500">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Footer/CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-2 text-base-content font-bold text-xl cursor-pointer hover:text-[#FF7D44] transition-colors">
            <span>Our Efficient Catering Service Workflow</span>
            <UtensilsCrossed className="size-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;


import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { UtensilsCrossed, Mail, MapPin, Phone } from "lucide-react";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-base-200 text-base-content pt-20 pb-10 border-t border-base-content/5">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          
          {/* Column 1: Branding & About */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 group">
              <div className="size-10 rounded-xl bg-gradient-to-br from-[#FF7D44] to-[#ff9d6e] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <UtensilsCrossed className="size-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">
                <span className="text-[#FF7D44]">FEAST</span>
                <span className="text-base-content font-black">IFY</span>
              </span>
            </div>
            <p className="text-base-content/60 leading-relaxed max-w-sm">
              We bring professional catering to your doorstep. From weddings to corporate events, we ensure every meal is a masterpiece of flavor and presentation.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaFacebookF />, href: '#' },
                { icon: <FaInstagram />, href: '#' },
                { icon: <FaTwitter />, href: '#' }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="size-9 rounded-full bg-base-300 flex items-center justify-center hover:bg-[#FF7D44] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-black tracking-tight text-[#FF7D44]">EXPLORE</h3>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'About Us', path: '/about' },
                { name: 'Join as Vendor', path: '/signup' }
              ].map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className="font-bold hover:text-[#FF7D44] transition-colors duration-300 w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-black tracking-tight text-[#FF7D44]">GET IN TOUCH</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 group">
                <div className="size-10 rounded-lg bg-base-300 flex items-center justify-center group-hover:bg-[#FF7D44] group-hover:text-white transition-colors">
                  <Mail className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-40">Email Us</div>
                  <div className="font-bold">hello@feastify.com</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="size-10 rounded-lg bg-base-300 flex items-center justify-center group-hover:bg-[#FF7D44] group-hover:text-white transition-colors">
                  <Phone className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-40">Call Us</div>
                  <div className="font-bold">+1 (555) 000-1234</div>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="size-10 rounded-lg bg-base-300 flex items-center justify-center group-hover:bg-[#FF7D44] group-hover:text-white transition-colors">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-40">Location</div>
                  <div className="font-bold">123 Culinary Ave, Foodie City</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-base-content/40">
          <div>© {new Date().getFullYear()} FEASTIFY. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#FF7D44] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FF7D44] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

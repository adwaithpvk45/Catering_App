import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings, getUserComplaints } from '../../api/user/userActions';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Sparkles, Calendar, BookOpen, MessageSquare, AlertCircle } from 'lucide-react';

const CustomerProfile = () => {
  const dispatch = useDispatch();
  
  // Load active user and dynamic stats from Redux
  const localData = JSON.parse(localStorage.getItem("userDetails")) || {};
  const user = localData?.existingUser || {};

  const bookings = useSelector((state) => state.user.Booking) || [];
  const complaints = useSelector((state) => state.user.complaints) || [];

  useEffect(() => {
    dispatch(getUserBookings());
    dispatch(getUserComplaints());
  }, [dispatch]);

  return (
    <div className="w-full py-1">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          My Account Profile
          <Sparkles className="size-6 text-[#FF7D44] animate-pulse" />
        </h2>
        <p className="text-sm text-base-content/50 font-medium mt-1">
          Manage your personal details, verify credentials, and track active bookings.
        </p>
      </motion.div>

      {/* Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Personal Card (Span 4) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-4 bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-2xl p-8 relative overflow-hidden flex flex-col justify-between items-center text-center h-full"
        >
          {/* Decorative ambient background glow */}
          <div className="absolute top-0 right-0 size-32 bg-[#FF7D44]/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
          
          <div className="w-full flex flex-col items-center">
            {/* Glowing Avatar Frame */}
            <div className="relative group mb-6 mt-4">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-[#FF7D44] to-amber-400 blur-md opacity-45 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative size-32 rounded-[2.5rem] overflow-hidden bg-base-200 ring-4 ring-[#FF7D44]/20 p-1.5 shadow-xl">
                <img 
                  src={user.profilePic || `https://i.pravatar.cc/300?img=12`} 
                  alt={user.name || "avatar"} 
                  className="w-full h-full object-cover rounded-[2rem] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
  
            {/* Core Info */}
            <h3 className="text-2xl font-black tracking-tight text-base-content capitalize leading-none">
              {user.name || "Anonymous User"}
            </h3>
            <span className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-[#FF7D44]/15 text-[#FF7D44] border border-[#FF7D44]/30 uppercase tracking-wider">
              <Shield className="size-3.5" />
              {user.role || "User"}
            </span>
          </div>
  
          <div className="w-full mt-6">
            {/* Horizontal Divider */}
            <div className="w-full h-px bg-base-content/10 mb-6"></div>
  
            {/* Profile metadata */}
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-base-content/60 px-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#FF7D44] opacity-85" />
                  Joined
                </span>
                <span className="text-base-content font-black">May 2026</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-base-content/60 px-2">
                <span className="flex items-center gap-1.5">
                  <Shield className="size-3.5 text-[#FF7D44] opacity-85" />
                  Verification Status
                </span>
                <span className="text-success font-black">
                  {user.role === 'admin' ? 'Platform Admin' : user.role === 'vendor' ? 'Verified Host' : 'Verified Client'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Account Details & Live Stats (Span 8) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-8 space-y-8"
        >
          {/* Credentials Card */}
          <div className="bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-2xl p-8 relative overflow-hidden">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              Account Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="group p-5 rounded-2xl bg-base-200/50 border border-base-content/5 hover:border-[#FF7D44]/20 hover:bg-base-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="size-8 rounded-xl bg-base-100 flex items-center justify-center shadow-sm">
                    <User className="size-4.5 text-[#FF7D44]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                    Full Name
                  </span>
                </div>
                <span className="text-base font-black tracking-tight text-base-content capitalize pl-1">
                  {user.name || "N/A"}
                </span>
              </div>

              {/* Email Address */}
              <div className="group p-5 rounded-2xl bg-base-200/50 border border-base-content/5 hover:border-[#FF7D44]/20 hover:bg-base-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="size-8 rounded-xl bg-base-100 flex items-center justify-center shadow-sm">
                    <Mail className="size-4.5 text-[#FF7D44]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                    Email Address
                  </span>
                </div>
                <span className="text-base font-black tracking-tight text-base-content pl-1 break-all">
                  {user.email || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Account Activity stats card */}
          <div className="bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-2xl p-8 relative overflow-hidden">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              Dashboard Activity & Metrics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Stat 1: Total Bookings */}
              <div className="p-5 rounded-2xl bg-base-200/50 border border-base-content/5 flex items-center gap-4 hover:bg-base-200 transition-colors">
                <div className="size-11 rounded-xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-base-content">{bookings.length}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Event Bookings</div>
                </div>
              </div>

              {/* Stat 2: Active Complaints */}
              <div className="p-5 rounded-2xl bg-base-200/50 border border-base-content/5 flex items-center gap-4 hover:bg-base-200 transition-colors">
                <div className="size-11 rounded-xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-base-content">{complaints.length}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Support Tickets</div>
                </div>
              </div>

              {/* Stat 3: Host Status */}
              <div className="p-5 rounded-2xl bg-base-200/50 border border-base-content/5 flex items-center gap-4 hover:bg-base-200 transition-colors">
                <div className="size-11 rounded-xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center">
                  <AlertCircle className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-success">Active & Good</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Account standing</div>
                </div>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default CustomerProfile;

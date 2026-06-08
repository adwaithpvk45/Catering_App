 
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/loginSlice';
import axiosInstance from '../api/common/axiosInstance';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Key, User, Phone, MapPin, X, ChevronDown, Save } from 'lucide-react';
import ResetPassword from './Drawer';

const DashboardAvatarSection = () => {
  const dispatch = useDispatch();
  
  // State variables
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get current user details from local storage
  const localData = JSON.parse(localStorage.getItem("userDetails")) || {};
  const user = localData?.existingUser || {};

  // Form states for profile settings
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required!");
      return;
    }

    setSaving(true);
    try {
      const response = await axiosInstance.patch("/api/user/updateProfile", {
        name,
        phone,
        address
      });
      const data = response.data;
      if (data.updatedUser) {
        // Sync local storage
        const updatedLocalData = {
          ...localData,
          existingUser: data.updatedUser
        };
        localStorage.setItem("userDetails", JSON.stringify(updatedLocalData));
        
        // Dispatch to update active Redux state (which dynamically refreshes all views instantly)
        dispatch(loginSuccess(updatedLocalData));
        toast.success("Profile updated successfully!");
        setIsSettingsOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Clickable Profile Trigger */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-base-200 border border-transparent hover:border-base-content/10 transition-all duration-300 focus:outline-none cursor-pointer group hover:scale-105 active:scale-95"
      >
        <div className="size-10 rounded-full overflow-hidden bg-base-200 ring-2 ring-[#FF7D44]/20 group-hover:ring-[#FF7D44]/50 transition-all">
          <img
            alt={user.name || "avatar"}
            src={user.profilePic || `https://i.pravatar.cc/300?img=12`}
            className="w-full h-full object-cover"
          />
        </div>
        <ChevronDown className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Transparent Click-out Backdrop overlay */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent cursor-default" 
          onClick={() => setDropdownOpen(false)}
        />
      )}

      {/* Dynamic Animated Dropdown Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2.5 w-52 z-50 bg-base-100 border border-base-content/10 shadow-2xl rounded-2xl p-2 font-outfit"
          >
            {/* Profile Settings Option */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                setIsSettingsOpen(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-base-content/85 hover:text-base-content hover:bg-base-200 rounded-xl transition-all cursor-pointer"
            >
              <Settings className="size-4 text-[#FF7D44]" />
              Profile Settings
            </button>

            {/* Reset Password Option */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                setDrawerOpen(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-base-content/85 hover:text-base-content hover:bg-base-200 rounded-xl transition-all cursor-pointer"
            >
              <Key className="size-4 text-[#FF7D44]" />
              Reset Password
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Reset Drawer (MUI Backdrop Integration) */}
      <ResetPassword open={drawerOpen} handleClose={() => setDrawerOpen(false)} />

      {/* Edit Profile Glassmorphic Modal */}
      {createPortal(
        <AnimatePresence>
          {isSettingsOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Blur backdrop overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSettingsOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative overflow-hidden bg-base-100 rounded-[2.5rem] border border-base-content/10 max-w-md w-full p-8 shadow-2xl z-[10000] font-outfit"
              >
                {/* Decorative Glimmer */}
                <div className="absolute top-0 right-0 size-32 bg-[#FF7D44]/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    Edit Profile
                    <Settings className="size-5 text-[#FF7D44] animate-spin-slow" />
                  </h3>
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/60 hover:text-base-content transition-all cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  
                  {/* Full Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your display name"
                        className="w-full bg-base-200 h-12 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 border-transparent focus:border-[#FF7D44]/30 transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="w-full bg-base-200 h-12 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 border-transparent focus:border-[#FF7D44]/30 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 size-5 opacity-40" />
                      <textarea 
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your default home address..."
                        className="w-full bg-base-200 rounded-2xl pl-12 pr-4 py-3 font-bold outline-none border-2 border-transparent focus:border-[#FF7D44]/30 transition-all text-sm leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsSettingsOpen(false)}
                      className="w-1/2 btn btn-ghost h-12 rounded-2xl font-black text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={saving}
                      className="w-1/2 btn btn-warning h-12 rounded-2xl text-white font-black text-sm shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {saving ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          Save Changes
                          <Save className="size-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};

export default DashboardAvatarSection;
import React from "react";
import { createPortal } from "react-dom";
import { Drawer } from "@mui/material";
import { X, ShieldAlert, User, Mail, Calendar, Activity, MapPin, Eye } from "lucide-react";

export default function UserDetails({ open, onClose, selectedUser, user }) {
  if (!selectedUser) {
    return null;
  }

  const userFields = [
    { label: "Name", value: selectedUser.name },
    { label: "Email", value: selectedUser.email },
    { label: "Status", value: selectedUser.status },
    { label: "Created At", value: selectedUser.createdTime },
  ];

  const bookingFields = [
    { label: "User", value: selectedUser.userName },
    { label: "Vendor", value: selectedUser.vendorName },
    { label: "Event Type", value: selectedUser.eventType },
    { label: "Event Date", value: selectedUser.eventDate },
    { label: "Location", value: selectedUser.location },
    { label: "Status", value: selectedUser.status }, // Fixed typo where they used selectedUser.createdTime for status!
  ];

  const isBooking = user === "bookings";
  const fields = isBooking ? bookingFields : userFields;

  return createPortal(
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          className: "backdrop-blur-sm bg-black/40",
        },
      }}
      PaperProps={{
        className: "!bg-base-100 !text-base-content border-l border-base-content/10 font-outfit w-full sm:w-[480px] p-8 shadow-2xl flex flex-col justify-between",
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxShadow: "none",
          backgroundImage: "none",
        },
      }}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Top Header */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center">
                <Eye className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-base-content tracking-tight leading-none">
                  {user === "user" ? "User Details" : user === "vendor" ? "Vendor Details" : "Booking Details"}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-40 mt-1 block">
                  Inspect record details
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/60 hover:text-base-content transition-all cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="w-full h-px bg-base-content/10 mb-8"></div>
        </div>

        {/* Info Grid */}
        <div className="flex-grow overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-5">
            {fields.map((field, index) => (
              <div key={index} className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value || "N/A"}
                  disabled
                  className="w-full bg-base-200 h-12 rounded-2xl px-4 border border-base-content/5 text-sm font-bold opacity-75 cursor-not-allowed text-base-content"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Close Button at bottom */}
        <div className="pt-8 pb-4">
          <button
            onClick={onClose}
            className="w-full btn btn-warning h-12 rounded-2xl text-white font-black text-sm shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            Close Details
            <X className="size-4" />
          </button>
        </div>
      </div>
    </Drawer>,
    document.body
  );
}

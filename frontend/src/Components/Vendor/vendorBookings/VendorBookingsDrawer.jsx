import React from "react";
import { createPortal } from "react-dom";
import { Drawer } from "@mui/material";
import { Form, Formik } from "formik";
import { statusChange } from "../../../api/vendor/bookingApi";
import { useDispatch } from "react-redux";
import { X, ShieldAlert, Check, Calendar, MapPin, User, Mail, Users, MessageSquare, DollarSign, Activity, ChevronDown } from "lucide-react";

const BookingDetailsDrawer = ({ open, onClose, booking }) => {
  const dispatch = useDispatch();

  if (!booking) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateStr;
    }
  };

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
        className: "!bg-base-100 !text-base-content border-l border-base-content/10 font-outfit w-full sm:w-[520px] p-8 shadow-2xl flex flex-col justify-between",
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
                <ShieldAlert className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-base-content tracking-tight leading-none">
                  Booking Details
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-40 mt-1 block">
                  Inspect and edit booking status
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

          <div className="w-full h-px bg-base-content/10 mb-6"></div>
        </div>

        {/* Scrollable Form Details */}
        <div className="flex-grow overflow-y-auto pr-1">
          <Formik
            initialValues={{
              status: booking.status || "Pending",
            }}
            onSubmit={(values) => {
              dispatch(statusChange({ id: booking._id, status: values.status }));
              onClose();
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                
                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* User name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <User className="size-3" /> User
                    </label>
                    <input
                      type="text"
                      value={booking.user?.name || "N/A"}
                      disabled
                      className="w-full bg-base-200 h-11 rounded-xl px-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content"
                    />
                  </div>

                  {/* User Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <Mail className="size-3" /> Email
                    </label>
                    <input
                      type="text"
                      value={booking.user?.email || "N/A"}
                      disabled
                      className="w-full bg-base-200 h-11 rounded-xl px-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={booking.category || "N/A"}
                      disabled
                      className="w-full bg-base-200 h-11 rounded-xl px-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content"
                    />
                  </div>

                  {/* Event Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <Calendar className="size-3" /> Event Date
                    </label>
                    <input
                      type="text"
                      value={formatDate(booking.eventDate)}
                      disabled
                      className="w-full bg-base-200 h-11 rounded-xl px-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content"
                    />
                  </div>

                  {/* Venue Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <MapPin className="size-3" /> Venue Location
                    </label>
                    <input
                      type="text"
                      value={booking.venueLocation || "N/A"}
                      disabled
                      className="w-full bg-base-200 h-11 rounded-xl px-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content"
                    />
                  </div>

                  {/* Guest Count */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <Users className="size-3" /> Guest Count
                    </label>
                    <input
                      type="text"
                      value={booking.guestCount || "0"}
                      disabled
                      className="w-full bg-base-200 h-11 rounded-xl px-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <DollarSign className="size-3" /> Price
                    </label>
                    <input
                      type="text"
                      value={booking.price || "N/A"}
                      disabled
                      className="w-full bg-base-200 h-11 rounded-xl px-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content"
                    />
                  </div>

                  {/* Booking Status Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <Activity className="size-3" /> Status
                    </label>
                    <div className="dropdown dropdown-bottom w-full">
                      <div 
                        tabIndex={0}
                        role="button"
                        className="w-full bg-base-200 h-11 rounded-xl px-4 flex items-center justify-between font-bold text-xs cursor-pointer border border-base-content/10 focus:border-[#FF7D44]/50 transition-all"
                      >
                        <span>{values.status}</span>
                        <ChevronDown className="size-4 opacity-50" />
                      </div>
                      <ul 
                        tabIndex={0}
                        className="dropdown-content menu p-2 bg-base-100 border border-base-content/10 rounded-2xl w-full z-[50] shadow-2xl mt-1 font-bold text-xs"
                      >
                        {["Pending", "Accepted", "Cancelled"].map((status) => (
                          <li key={status}>
                            <a 
                              onClick={() => {
                                setFieldValue("status", status);
                                document.activeElement.blur();
                              }}
                            >
                              {status}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <MessageSquare className="size-3" /> Description
                    </label>
                    <textarea
                      value={booking.description || "No description provided."}
                      disabled
                      rows={2}
                      className="w-full bg-base-200 rounded-xl p-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content resize-none leading-relaxed"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      Notes
                    </label>
                    <textarea
                      value={booking.notes || "No notes provided."}
                      disabled
                      rows={2}
                      className="w-full bg-base-200 rounded-xl p-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content resize-none leading-relaxed"
                    />
                  </div>

                </div>

                {/* Submit button at bottom */}
                <div className="pt-6 pb-2">
                  <button
                    type="submit"
                    className="w-full btn btn-warning h-12 rounded-xl text-white font-black text-sm shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    Save Changes
                    <Check className="size-4" />
                  </button>
                </div>

              </Form>
            )}
          </Formik>
        </div>

      </div>
    </Drawer>,
    document.body
  );
};

export default BookingDetailsDrawer;

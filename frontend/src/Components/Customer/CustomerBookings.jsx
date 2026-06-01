import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings } from '../../api/user/userActions';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, UtensilsCrossed, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

const CustomerBookings = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.user.Booking);

  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-success/10 text-success border border-success/20">
            <CheckCircle2 className="size-3.5" />
            Accepted
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-error/10 text-error border border-error/20">
            <XCircle className="size-3.5" />
            Cancelled
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-warning/10 text-warning border border-warning/20">
            <Clock className="size-3.5" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="w-full py-1">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          My Event Bookings
          <UtensilsCrossed className="size-6 text-[#FF7D44]" />
        </h2>
        <p className="text-sm text-base-content/50 font-medium mt-1">
          Keep track of your active catering orders, verify vendor verification, and track scheduling details.
        </p>
      </motion.div>

      {/* Bookings List/Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-2xl overflow-hidden"
        style={{ height: 'calc(100vh - 280px)' }}
      >
        <div className="overflow-auto w-full h-full">
          <table className="table w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-base-200">
              <tr className="border-b border-base-content/10">
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Catering Provider</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Event Date</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Venue Location</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Guests</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings && bookings.length > 0 ? (
                bookings.map((booking, idx) => (
                  <motion.tr 
                    key={booking._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + (idx * 0.05) }}
                    className="border-b border-base-content/5 hover:bg-base-200/30 transition-colors duration-200"
                  >
                    {/* Vendor Column */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-base-200 overflow-hidden flex items-center justify-center border border-[#FF7D44]/20 shadow-sm">
                          {booking.vendor?.profile ? (
                            <img src={booking.vendor.profile} alt="Vendor" className="size-full object-cover" />
                          ) : (
                            <UtensilsCrossed className="size-5 text-[#FF7D44]" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-sm text-base-content leading-tight">
                            {booking.vendor?.vendorName || "Unknown Vendor"}
                          </div>
                          <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-0.5">Verified Partner</div>
                        </div>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="py-5 px-6 text-sm font-bold text-base-content/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 opacity-40 text-[#FF7D44]" />
                        <span>
                          {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Venue Location Column */}
                    <td className="py-5 px-6 text-sm font-bold text-base-content/80">
                      <div className="flex items-center gap-2 max-w-xs truncate">
                        <MapPin className="size-4 opacity-40 text-[#FF7D44]" />
                        <span>{booking.venueLocation || "TBD"}</span>
                      </div>
                    </td>

                    {/* Guests Column */}
                    <td className="py-5 px-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="bg-base-200/80 px-3 py-1 rounded-lg border border-base-content/5 font-black text-xs flex items-center gap-1.5">
                          <Users className="size-3.5 opacity-50" />
                          <span>{booking.guestCount || "-"} guests</span>
                        </div>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-5 px-6">
                      {getStatusBadge(booking.status)}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-2">
                        <AlertCircle className="size-6" />
                      </div>
                      <h4 className="font-black text-lg text-base-content/70">No Bookings Found</h4>
                      <p className="text-xs font-semibold text-base-content/40 max-w-sm">
                        You have not placed any catering requests yet. Browse our verified menus and find the perfect host for your events!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerBookings;

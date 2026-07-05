 
import React, { useState, useEffect } from "react";
import BookingDetailsDrawer from "./VendorBookingsDrawer";
import { useDispatch, useSelector } from "react-redux";
import { getVendorBookings, statusChange, markBookingFullyPaidAction } from "../../../api/vendor/bookingApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Eye,
  Check,
  Clock,
  ChevronDown,
} from "lucide-react";

const VendorBookings = () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const vendorId = userDetails?.existingUser?._id;

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.booking.booking) || [];

  useEffect(() => {
    if (vendorId) {
      dispatch(getVendorBookings(vendorId));
    }
  }, [dispatch, vendorId]);

  // Reset page when search/filter changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery, eventFilter]);

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter((b) => {
    const venue = b.venueLocation || "";
    const category = b.category || "";
    const matchesSearch =
      venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent = eventFilter === "All" || b.event === eventFilter;
    return matchesSearch && matchesEvent;
  });

  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get unique event types dynamically
  const eventTypes = ["All", ...new Set(bookings.map((b) => b.event).filter(Boolean))];

  const handleStatusToggle = (e, booking) => {
    e.stopPropagation(); // Prevent row click opening drawer
    const newStatus = booking.status === "Pending" ? "Accepted" : "Pending";
    dispatch(statusChange({ id: booking._id, status: newStatus }));
  };

  const handleMarkFullyPaid = (e, bookingId) => {
    e.stopPropagation();
    dispatch(markBookingFullyPaidAction(bookingId));
  };

  return (
    <div className="py-6 px-1 max-w-full font-outfit select-none space-y-6">
      
      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-2xl font-black text-base-content tracking-tight leading-none flex items-center gap-2">
            Booking Management
            <Calendar className="size-6 text-[#FF7D44]" />
          </h2>
          <p className="text-xs font-semibold text-base-content/50 mt-1.5">
            Monitor client bookings, accept pending requests, and manage venues/guests count.
          </p>
        </div>
      </motion.div>

      {/* Filter and Search Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-wrap items-center justify-between gap-4 p-5 bg-base-100 rounded-3xl border border-base-content/10 shadow-lg"
      >
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 opacity-40" />
            <input
              type="text"
              placeholder="Search by user, venue, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-base-200 h-11 rounded-2xl pl-11 pr-4 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 transition-all text-xs"
            />
          </div>

          {/* Event Filter Dropdown */}
          <div className="dropdown dropdown-bottom w-full sm:w-52">
            <div 
              tabIndex={0} 
              role="button" 
              className="w-full bg-base-200 h-11 rounded-2xl px-4 flex items-center justify-between font-bold text-xs cursor-pointer border border-transparent focus:border-[#FF7D44]/30 transition-all"
            >
              <span className="flex items-center gap-2">
                <Filter className="size-4 opacity-40" />
                {eventFilter === "All" ? "All Events" : eventFilter}
              </span>
              <ChevronDown className="size-4 opacity-40" />
            </div>
            <ul 
              tabIndex={0} 
              className="dropdown-content menu p-2 bg-base-100 border border-base-content/10 rounded-2xl w-full z-[50] shadow-2xl mt-1 font-bold text-xs"
            >
              {eventTypes.map((event) => (
                <li key={event}>
                  <a 
                    onClick={() => {
                      setEventFilter(event);
                      document.activeElement.blur();
                    }}
                  >
                    {event === "All" ? "All Events" : event}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 pr-2">
          {filteredBookings.length} Bookings found
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-2xl overflow-hidden"
        style={{ height: 'calc(100vh - 357px)' }}
      >
        <div className="overflow-auto w-full h-full flex flex-col justify-between">
          <table className="table w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-base-200">
              <tr className="border-b border-base-content/10">
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">User</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Services</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Event Date</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Guests</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Venue</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Booking Status</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Payment Status</th>
                <th className="py-5 px-6 text-center text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking, idx) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
                    onClick={() => handleRowClick(booking)}
                    className="border-b border-base-content/5 hover:bg-base-200/30 transition-colors duration-200 cursor-pointer"
                  >
                    {/* User */}
                    <td className="py-4 px-6">
                      <div className="font-black text-sm text-base-content leading-tight">
                        {booking.user?.name || "Guest User"}
                      </div>
                      <div className="text-[10px] font-bold opacity-45 mt-0.5">
                        {booking.user?.email || "No email provided"}
                      </div>
                    </td>

                    {/* Services */}
                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      <span className="truncate max-w-[200px] block" title={booking.services?.map((s) => s.name).join(", ")}>
                        {booking.services?.map((s) => s.name).join(", ") || "No services listed"}
                      </span>
                    </td>

                    {/* Event Date */}
                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      {booking.eventDate
                        ? new Date(booking.eventDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>

                    {/* Guest Count */}
                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      <div className="flex items-center gap-1">
                        <Users className="size-3.5 opacity-40" />
                        <span>{booking.guestCount || "-"}</span>
                      </div>
                    </td>

                    {/* Venue Location */}
                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5 opacity-40 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{booking.venueLocation || "N/A"}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          booking.status === "Confirmed"
                            ? "bg-success/10 text-success border border-success/20"
                            : booking.status === "Accepted"
                            ? "bg-info/10 text-info border border-info/20"
                            : booking.status === "Cancelled"
                            ? "bg-error/10 text-error border border-error/20"
                            : "bg-warning/10 text-warning border border-warning/20"
                        }`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </td>

                    {/* Payment Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          booking.paymentStatus === "Fully Paid"
                            ? "bg-success/10 text-success border border-success/20"
                            : booking.paymentStatus === "Advance Paid"
                            ? "bg-indigo/10 text-indigo-500 border border-indigo-500/20"
                            : "bg-base-300 text-base-content/50 border border-base-content/10"
                        }`}
                      >
                        {booking.paymentStatus || "Unpaid"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        {booking.status !== "Cancelled" && booking.status !== "Confirmed" && (
                          <button
                            onClick={(e) => handleStatusToggle(e, booking)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                              booking.status === "Pending"
                                ? "bg-success/10 text-success border-success/20 hover:bg-success hover:text-white"
                                : "bg-warning/10 text-warning border-warning/20 hover:bg-warning hover:text-white"
                            }`}
                          >
                            {booking.status === "Pending" ? "Accept" : "Revert"}
                          </button>
                        )}
                        {booking.status === "Confirmed" && booking.paymentStatus === "Advance Paid" && (
                          <button
                            onClick={(e) => handleMarkFullyPaid(e, booking._id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-transparent shadow-sm hover:shadow"
                          >
                            Mark Fully Paid
                          </button>
                        )}
                        <button
                          onClick={() => handleRowClick(booking)}
                          className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/60 hover:text-base-content transition-all cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-20 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-2">
                        <AlertCircle className="size-6" />
                      </div>
                      <h4 className="font-black text-lg text-base-content/70">No Bookings Found</h4>
                      <p className="text-xs font-semibold text-base-content/40 max-w-sm">
                        There are no bookings matching your criteria in the database yet.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Custom Pagination Footer */}
          <div className="flex justify-between items-center p-5 border-t border-base-content/10 bg-base-200/50 mt-auto">
            <span className="text-xs font-semibold text-base-content/50">
              Showing {filteredBookings.length ? page * rowsPerPage + 1 : 0} to{" "}
              {Math.min((page + 1) * rowsPerPage, filteredBookings.length)} of{" "}
              {filteredBookings.length} bookings
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPage((p) =>
                    (p + 1) * rowsPerPage < filteredBookings.length ? p + 1 : p
                  )
                }
                disabled={(page + 1) * rowsPerPage >= filteredBookings.length}
                className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Details Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedBooking && (
          <BookingDetailsDrawer
            open={drawerOpen}
            onClose={handleDrawerClose}
            booking={selectedBooking}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default VendorBookings;

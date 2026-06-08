/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookings } from "../../../api/admin/adminActions";
import UserDetails from "../Users/UserDetails";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  MapPin,
  AlertCircle,
  Eye,
  Briefcase,
} from "lucide-react";

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.admin) || [];

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  // Reset page when search changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  // Map backend data to table format
  const formattedBookings = bookings.map((b) => ({
    id: b._id,
    userName: b.user?.name || (typeof b.user === 'string' ? b.user : b.user?.email) || "Unknown User",
    vendorName: b.vendor && b.vendor.length > 0 ? (b.vendor[0]?.name || b.vendor[0]?.email) : "Unknown Vendor",
    eventType: b.category || "N/A",
    eventDate: b.eventDate ? dayjs(b.eventDate).format("YYYY-MM-DD") : "N/A",
    location: b.venueLocation || "N/A",
    status: b.status || "Pending",
    raw: b,
  }));

  const filteredBookings = formattedBookings.filter((booking) => {
    const query = searchQuery.trim().toLowerCase();
    return (
      booking.vendorName.toLowerCase().includes(query) ||
      booking.eventType.toLowerCase().includes(query) ||
      booking.userName.toLowerCase().includes(query) ||
      booking.location.toLowerCase().includes(query)
    );
  });

  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            Bookings Management
            <Briefcase className="size-6 text-[#FF7D44]" />
          </h2>
          <p className="text-xs font-semibold text-base-content/50 mt-1.5">
            Overview of all platform catering reservations, event schedules, and booking status.
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
              placeholder="Search by user, vendor, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-base-200 h-11 rounded-2xl pl-11 pr-4 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 transition-all text-xs"
            />
          </div>
        </div>

        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 pr-2">
          {filteredBookings.length} Total Bookings
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-2xl overflow-hidden"
        style={{ height: 'calc(100vh - 280px)' }}
      >
        <div className="overflow-auto w-full h-full flex flex-col justify-between">
          <table className="table w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-base-200">
              <tr className="border-b border-base-content/10">
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">User</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Vendor</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Event Type</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Date</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Location</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Status</th>
                <th className="py-5 px-6 text-center text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking, idx) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
                    className="border-b border-base-content/5 hover:bg-base-200/30 transition-colors duration-200"
                  >
                    {/* User */}
                    <td className="py-4 px-6 text-sm font-black text-base-content capitalize">{booking.userName}</td>

                    {/* Vendor */}
                    <td className="py-4 px-6 text-sm font-black text-[#FF7D44] capitalize">{booking.vendorName}</td>

                    {/* Event Type */}
                    <td className="py-4 px-6 text-xs font-bold text-base-content/70">{booking.eventType}</td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs font-bold text-base-content/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3.5 opacity-45 text-[#FF7D44]" />
                        <span>{booking.eventDate}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-xs font-bold text-base-content/70">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5 opacity-45 text-[#FF7D44]" />
                        <span>{booking.location}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          booking.status === "Approved" || booking.status === "Accepted" || booking.status === "Completed"
                            ? "bg-success/10 text-success border border-success/20"
                            : booking.status === "Rejected" || booking.status === "Cancelled"
                            ? "bg-error/10 text-error border border-error/20"
                            : "bg-warning/10 text-warning border border-warning/20"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(booking)}
                          className="p-2 rounded-xl bg-base-200 hover:bg-warning hover:text-white text-base-content/60 transition-all cursor-pointer"
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
                  <td colSpan={7} className="py-20 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-2">
                        <AlertCircle className="size-6" />
                      </div>
                      <h4 className="font-black text-lg text-base-content/70">No Bookings Found</h4>
                      <p className="text-xs font-semibold text-base-content/40 max-w-sm">
                        There are no bookings matching your criteria in the system yet.
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

      {/* Details Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedBooking && (
          <UserDetails
            open={drawerOpen}
            onClose={handleDrawerClose}
            selectedUser={selectedBooking}
            user={"bookings"}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminBookings;

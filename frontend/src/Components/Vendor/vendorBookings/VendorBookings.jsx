 
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

import axios from "axios";
import appConfig from "../../../api/common/appConfig";
import toast from "react-hot-toast";
import { exportToCSV } from "../../../utils/csvExport";
import { Download } from "lucide-react";

const VendorBookings = () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const vendorId = userDetails?.existingUser?._id;

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const dispatch = useDispatch();
  const { booking: bookings, pagination } = useSelector((state) => state.booking) || { booking: [], pagination: {} };
  const bookingPagination = pagination || { total: 0, page: 1, limit: 5, pages: 1 };

  // Debounced search & fetch on page or filter changes
  useEffect(() => {
    if (vendorId) {
      const delayDebounceFn = setTimeout(() => {
        dispatch(getVendorBookings(vendorId, page, 5, searchQuery, statusFilter, paymentFilter, startDate, endDate));
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [dispatch, vendorId, page, searchQuery, statusFilter, paymentFilter, startDate, endDate]);

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset page to 1
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset page to 1
  };

  const handlePaymentChange = (e) => {
    setPaymentFilter(e.target.value);
    setPage(1); // Reset page to 1
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setPage(1); // Reset page to 1
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setPage(1); // Reset page to 1
  };

  const handleExport = async () => {
    if (!vendorId) return;
    setExportLoading(true);
    try {
      const res = await axios.get(
        `${appConfig.baseURL}/api/booking/vendor/${vendorId}?export=true&search=${encodeURIComponent(searchQuery)}&status=${statusFilter}&paymentStatus=${paymentFilter}&startDate=${startDate}&endDate=${endDate}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${appConfig.token}`
          }
        }
      );
      if (res.data.success) {
        const headers = ["Booking ID", "Customer Name", "Customer Email", "Event Type", "Event Date", "Venue Location", "Status", "Payment Status", "Guest Count", "Total Price", "Created At"];
        const rows = res.data.data.map(b => [
          b._id,
          b.user?.name || "Unknown User",
          b.user?.email || "No Email",
          b.category || "N/A",
          b.eventDate ? dayjs(b.eventDate).format("YYYY-MM-DD") : "N/A",
          b.venueLocation || "N/A",
          b.status || "Pending",
          b.paymentStatus || "Unpaid",
          b.guestCount || 0,
          b.totalPrice || 0,
          b.createdAt ? dayjs(b.createdAt).format("YYYY-MM-DD HH:mm") : "N/A"
        ]);
        exportToCSV("Feastify_Vendor_Bookings", headers, rows);
        toast.success("Bookings list exported successfully!");
      } else {
        toast.error("Failed to export bookings.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to export data.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleStatusToggle = (e, booking) => {
    e.stopPropagation(); // Prevent row click opening drawer
    const newStatus = booking.status === "Pending" ? "Accepted" : "Pending";
    dispatch(statusChange({ id: booking._id, status: newStatus }, page, 5, searchQuery, statusFilter, paymentFilter, startDate, endDate));
  };

  const handleMarkFullyPaid = (e, bookingId) => {
    e.stopPropagation();
    dispatch(markBookingFullyPaidAction(bookingId, page, 5, searchQuery, statusFilter, paymentFilter, startDate, endDate));
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
        className="flex flex-col gap-4 p-5 bg-base-100 rounded-3xl border border-base-content/10 shadow-lg"
      >
        <div className="flex flex-wrap items-center gap-4 w-full">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 opacity-40" />
            <input
              type="text"
              placeholder="Search by user, venue, type..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-base-200 h-11 rounded-2xl pl-11 pr-4 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 transition-all text-xs"
            />
          </div>

          {/* Booking Status Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-40 text-base-content" />
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="select bg-base-200 h-11 rounded-2xl pl-9 pr-8 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 text-xs cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-40 text-base-content" />
            <select
              value={paymentFilter}
              onChange={handlePaymentChange}
              className="select bg-base-200 h-11 rounded-2xl pl-9 pr-8 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 text-xs cursor-pointer appearance-none min-w-[150px]"
            >
              <option value="">All Payments</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Advance Paid">Advance Paid</option>
              <option value="Fully Paid">Fully Paid</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase opacity-50">From</span>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="input bg-base-200 h-11 rounded-2xl font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 text-xs px-3 cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase opacity-50">To</span>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="input bg-base-200 h-11 rounded-2xl font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 text-xs px-3 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-between items-center w-full border-t border-base-content/5 pt-3">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
            Filters active • Query matches: {bookingPagination.total} bookings
          </div>
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="btn btn-ghost btn-sm h-11 rounded-2xl border border-base-content/10 hover:bg-base-200 text-xs font-black px-4 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="size-4" />
            <span>{exportLoading ? "Exporting..." : "Export CSV"}</span>
          </button>
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-2xl overflow-hidden flex flex-col justify-between"
        style={{ height: 'calc(100vh - 357px)' }}
      >
        <div className="overflow-auto w-full flex-grow">
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
              {bookings.length > 0 ? (
                bookings.map((booking, idx) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
                    onClick={() => handleRowClick(booking)}
                    className="border-b border-base-content/5 hover:bg-base-200/30 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="font-black text-sm text-base-content leading-tight">
                        {booking.user?.name || "Guest User"}
                      </div>
                      <div className="text-[10px] font-bold opacity-45 mt-0.5">
                        {booking.user?.email || "No email provided"}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      <span className="truncate max-w-[200px] block" title={booking.services?.map((s) => s.name).join(", ")}>
                        {booking.services?.map((s) => s.name).join(", ") || "No services listed"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      {booking.eventDate ? dayjs(booking.eventDate).format("YYYY-MM-DD") : "N/A"}
                    </td>

                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      {booking.guestCount || 0}
                    </td>

                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-[#FF7D44]" />
                        <span>{booking.venueLocation || "N/A"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          booking.status === "Pending"
                            ? "bg-warning/10 text-warning border border-warning/20"
                            : booking.status === "Accepted"
                            ? "bg-info/10 text-info border border-info/20"
                            : booking.status === "Confirmed"
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-error/10 text-error border border-error/20"
                        }`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          booking.paymentStatus === "Fully Paid"
                            ? "bg-success/10 text-success border border-success/20"
                            : booking.paymentStatus === "Advance Paid"
                            ? "bg-info/10 text-info border border-info/20"
                            : "bg-error/10 text-error border border-error/20"
                        }`}
                      >
                        {booking.paymentStatus || "Unpaid"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        {booking.status !== "Confirmed" && booking.status !== "Cancelled" && (
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
        </div>

        {/* Custom Pagination Footer */}
        <div className="flex justify-between items-center p-5 border-t border-base-content/10 bg-base-200/50">
          <span className="text-xs font-semibold text-base-content/50">
            Showing {bookings.length ? (bookingPagination.page - 1) * 5 + 1 : 0} to{" "}
            {Math.min(bookingPagination.page * 5, bookingPagination.total)} of{" "}
            {bookingPagination.total} bookings
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(bookingPagination.pages, p + 1))}
              disabled={page >= bookingPagination.pages}
              className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
            >
              Next
            </button>
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

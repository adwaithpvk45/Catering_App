 
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
  Download,
  Filter,
} from "lucide-react";
import { getVendorBrandName } from "../../../store/data";
import axios from "axios";
import appConfig from "../../../api/common/appConfig";
import toast from "react-hot-toast";
import { exportToCSV } from "../../../utils/csvExport";

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, pagination } = useSelector((state) => state.admin) || { bookings: [], pagination: {} };
  const bookingPagination = pagination?.bookings || { total: 0, page: 1, limit: 5, pages: 1 };

  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  // Debounced search & fetch on page or filter changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(getBookings(page, 5, searchQuery, statusFilter, paymentFilter, startDate, endDate));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchQuery, statusFilter, paymentFilter, startDate, endDate]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset page to 1 when search query changes
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
    setExportLoading(true);
    try {
      const res = await axios.get(
        `${appConfig.baseURL}/api/admin/bookings?export=true&search=${encodeURIComponent(searchQuery)}&status=${statusFilter}&paymentStatus=${paymentFilter}&startDate=${startDate}&endDate=${endDate}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${appConfig.token}`
          }
        }
      );
      if (res.data.success) {
        const headers = [
          "Booking ID", 
          "Customer Name", 
          "Customer Email", 
          "Vendor Name", 
          "Event Type", 
          "Event Date", 
          "Venue Location", 
          "Status", 
          "Payment Status", 
          "Guest Count", 
          "Total Price", 
          "Created At"
        ];
        const rows = res.data.bookings.map(b => {
          const v = b.vendor && b.vendor.length > 0 ? b.vendor[0] : null;
          const brand = v ? getVendorBrandName(v._id) : "N/A";
          return [
            b._id,
            b.user?.name || "Unknown User",
            b.user?.email || "No Email",
            brand,
            b.category || "N/A",
            b.eventDate ? dayjs(b.eventDate).format("YYYY-MM-DD") : "N/A",
            b.venueLocation || "N/A",
            b.status || "Pending",
            b.paymentStatus || "Unpaid",
            b.guestCount || 0,
            b.totalPrice || 0,
            b.createdAt ? dayjs(b.createdAt).format("YYYY-MM-DD HH:mm") : "N/A"
          ];
        });
        exportToCSV("Feastify_Bookings", headers, rows);
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
    vendorName: b.vendor && b.vendor.length > 0
      ? (() => {
          const v = b.vendor[0];
          const brand = getVendorBrandName(v._id);
          return v.name ? `${brand} (${v.name})` : brand;
        })()
      : "Unknown Vendor",
    eventType: b.category || "N/A",
    eventDate: b.eventDate ? dayjs(b.eventDate).format("YYYY-MM-DD") : "N/A",
    location: b.venueLocation || "N/A",
    status: b.status || "Pending",
    raw: b,
  }));

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
        className="flex flex-col gap-4 p-5 bg-base-100 rounded-3xl border border-base-content/10 shadow-lg"
      >
        <div className="flex flex-wrap items-center gap-4 w-full">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 opacity-40" />
            <input
              type="text"
              placeholder="Search by user, vendor, venue..."
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
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Vendor</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Event Type</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Date</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Location</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Status</th>
                <th className="py-5 px-6 text-center text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formattedBookings.length > 0 ? (
                formattedBookings.map((booking, idx) => (
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
        </div>

        {/* Custom Pagination Footer */}
        <div className="flex justify-between items-center p-5 border-t border-base-content/10 bg-base-200/50">
          <span className="text-xs font-semibold text-base-content/50">
            Showing {formattedBookings.length ? (bookingPagination.page - 1) * 5 + 1 : 0} to{" "}
            {Math.min(bookingPagination.page * 5, bookingPagination.total)} of{" "}
            {bookingPagination.total} bookings
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={bookingPagination.page === 1}
              className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={bookingPagination.page >= bookingPagination.pages}
              className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
            >
              Next
            </button>
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

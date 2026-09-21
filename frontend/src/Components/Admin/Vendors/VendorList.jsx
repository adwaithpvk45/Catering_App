 
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVendors, toggleAccountStatusAction } from "../../../api/admin/adminActions";
import dayjs from "dayjs";
import TableContent from "../../../common ui/Table";
import UserDetails from "../Users/UserDetails";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, AlertCircle, Download, Filter, MapPin, LayoutList } from "lucide-react";
import axios from "axios";
import axiosInstance from "../../../api/common/axiosInstance";
import appConfig from "../../../api/common/appConfig";
import toast from "react-hot-toast";
import { exportToCSV } from "../../../utils/csvExport";
import CatererDistributionMap from "../../Common/CatererDistributionMap";

export default function VendorsList() {
  const dispatch = useDispatch();
  const { vendors, pagination } = useSelector((state) => state.admin);
  const vendorPagination = pagination?.vendors || { total: 0, page: 1, limit: 5, pages: 1 };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" | "map"
  const [mapVendors, setMapVendors] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);

  const fetchMapVendors = async () => {
    setMapLoading(true);
    try {
      const res = await axiosInstance.get('/api/admin/vendors-distribution');
      if (res.data.success) {
        setMapVendors(res.data.vendors);
      }
    } catch (err) {
      console.error("Error fetching map vendors:", err);
    } finally {
      setMapLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === "map") {
      fetchMapVendors();
    }
  }, [viewMode]);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleDrawerOpen = (data) => {
    setSelectedUser(data);
    setDrawerOpen(true);
  };

  const handleMapVendorSelect = (vendor) => {
    setSelectedUser({
      id: vendor._id || vendor.id,
      name: vendor.name,
      email: vendor.email,
      status: vendor.status,
      phone: vendor.phone,
      location: vendor.location,
      createdTime: dayjs(vendor.createdAt).format("YYYY-MM-DD")
    });
    setDrawerOpen(true);
  };

  // Debounced search & fetch on page or filter change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(getVendors(page, 5, searchQuery, statusFilter));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchQuery, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset page to 1 when search query changes
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset page to 1 when status filter changes
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const res = await axios.get(
        `${appConfig.baseURL}/api/admin/vendors?export=true&search=${encodeURIComponent(searchQuery)}&status=${statusFilter}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${appConfig.token}`
          }
        }
      );
      if (res.data.success) {
        const headers = ["Vendor ID", "Name", "Email", "Status", "Created At"];
        const rows = res.data.vendors.map(v => [
          v._id,
          v.name || "Unknown Vendor",
          v.email || "No Email",
          v.status || "active",
          v.createdAt ? dayjs(v.createdAt).format("YYYY-MM-DD HH:mm") : "N/A"
        ]);
        exportToCSV("Feastify_Vendors", headers, rows);
        toast.success("Vendors list exported successfully!");
      } else {
        toast.error("Failed to export vendors.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to export data.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleBlockUnblock = (id, action) => {
    const vendorToBlock = formattedVendors.find((v) => v.id === id);
    if (vendorToBlock) {
      setTargetUser({
        id,
        name: vendorToBlock.name,
        email: vendorToBlock.email,
        action,
      });
      setBlockConfirmOpen(true);
    }
  };

  const confirmBlockUnblock = () => {
    if (targetUser) {
      const nextStatus = targetUser.action === "block" ? "blocked" : "active";
      dispatch(toggleAccountStatusAction(targetUser.id, nextStatus, "vendor", page, 5, searchQuery, statusFilter));
      setBlockConfirmOpen(false);
      setTargetUser(null);
    }
  };

  const formattedVendors = vendors.map((vendor) => ({
    id: vendor._id,
    name: vendor.name || "Unknown Vendor",
    email: vendor.email || "No Email",
    status: vendor.status || "active",
    createdTime: dayjs(vendor.createdAt).format("YYYY-MM-DD"),
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          <div>
            <h2 className="text-2xl font-black text-base-content tracking-tight leading-none flex items-center gap-2">
              Vendors Management
              <Sparkles className="size-6 text-[#FF7D44]" />
            </h2>
            <p className="text-xs font-semibold text-base-content/50 mt-1.5">
              Admin dashboard control panel for monitoring catering hosts, verifying approvals, and managing blocklists.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 bg-base-200/80 border border-base-content/10 rounded-2xl shadow-inner">
            <button
              onClick={() => setViewMode("table")}
              className={`btn btn-xs sm:btn-sm rounded-xl font-bold gap-2 transition-all cursor-pointer ${
                viewMode === "table"
                  ? "btn-primary text-white shadow-md"
                  : "btn-ghost text-base-content/70 hover:text-base-content"
              }`}
            >
              <LayoutList className="size-4" />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`btn btn-xs sm:btn-sm rounded-xl font-bold gap-2 transition-all cursor-pointer ${
                viewMode === "map"
                  ? "btn-primary text-white shadow-md"
                  : "btn-ghost text-base-content/70 hover:text-base-content"
              }`}
            >
              <MapPin className="size-4 text-emerald-400" />
              <span>Map View (OSM)</span>
            </button>
          </div>
        </div>
      </motion.div>

      {viewMode === "map" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {mapLoading ? (
            <div className="h-[520px] rounded-3xl bg-base-100 border border-base-content/10 flex flex-col items-center justify-center gap-3">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-sm font-semibold text-base-content/60">Loading caterer coordinates on OpenStreetMap...</p>
            </div>
          ) : (
            <CatererDistributionMap
              vendors={mapVendors.length ? mapVendors : vendors}
              height="620px"
              onSelectVendor={handleMapVendorSelect}
              title="Caterers Geographic Distribution (OMS)"
              subtitle="Live OpenStreetMap visualization of catering partners, location pins, and delivery coverage"
            />
          )}
        </motion.div>
      ) : (
        <>
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
                  placeholder="Search by vendor name, email..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-base-200 h-11 rounded-2xl pl-11 pr-4 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 transition-all text-xs"
                />
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-40 text-base-content" />
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="select bg-base-200 h-11 rounded-2xl pl-9 pr-8 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 text-xs cursor-pointer appearance-none min-w-[130px]"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                disabled={exportLoading}
                className="btn btn-ghost btn-sm h-11 rounded-2xl border border-base-content/10 hover:bg-base-200 text-xs font-black px-4 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="size-4" />
                <span>{exportLoading ? "Exporting..." : "Export CSV"}</span>
              </button>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40 pr-2">
                {vendorPagination.total} Active Hosts
              </div>
            </div>
          </motion.div>

          {/* Table Content */}
          <TableContent
            users={formattedVendors}
            pagination={vendorPagination}
            onPageChange={(newPage) => setPage(newPage)}
            handleBlockUnblock={handleBlockUnblock}
            handleDrawerOpen={handleDrawerOpen}
          />
        </>
      )}

      {/* User Details Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedUser && (
          <UserDetails
            open={drawerOpen}
            onClose={handleDrawerClose}
            selectedUser={selectedUser}
            user={"vendor"}
          />
        )}
      </AnimatePresence>

      {/* Glassmorphic Block/Unblock Confirmation Modal */}
      <AnimatePresence>
        {blockConfirmOpen && targetUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-sm p-6 bg-base-100/90 backdrop-blur-md border border-base-content/10 rounded-3xl shadow-2xl font-outfit"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`size-10 rounded-xl flex items-center justify-center flex-shrink-0 ${targetUser.action === "block" ? "bg-error/10 text-error" : "bg-success/10 text-success"}`}>
                  <AlertCircle className="size-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-base-content capitalize">{targetUser.action} Account</h3>
                  <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider mt-0.5">Please confirm your action</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-base-content/60 leading-relaxed mb-6">
                Are you sure you want to {targetUser.action} the account for <strong className="text-base-content">{targetUser.name}</strong> ({targetUser.email})? 
                {targetUser.action === "block" ? " This vendor will be immediately logged out and prevented from signing in." : " They will be allowed to log back in to their account."}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setBlockConfirmOpen(false);
                    setTargetUser(null);
                  }}
                  className="btn btn-ghost rounded-xl text-xs font-black px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBlockUnblock}
                  className={`btn ${targetUser.action === "block" ? "btn-error shadow-error/15" : "btn-success shadow-success/15"} text-white rounded-xl text-xs font-black px-5 cursor-pointer shadow-lg`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

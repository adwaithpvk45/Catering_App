/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVendors } from "../../../api/admin/adminActions";
import dayjs from "dayjs";
import TableContent from "../../../common ui/Table";
import UserDetails from "../Users/UserDetails";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

export default function VendorsList() {
  const dispatch = useDispatch();
  const { vendors } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleDrawerOpen = (data) => {
    setSelectedUser(data);
    setDrawerOpen(true);
  };

  useEffect(() => {
    dispatch(getVendors());
  }, [dispatch]);

  const handleBlockUnblock = (id, action) => {
    console.log(`User ${id} ${action}`);
  };

  const formattedVendors = vendors.map((vendor) => ({
    id: vendor._id,
    name: vendor.name || "Unknown Vendor",
    email: vendor.email || "No Email",
    status: vendor.isApproved ? "active" : "pending",
    createdTime: dayjs(vendor.createdAt).format("YYYY-MM-DD"),
  }));

  const filteredUsers = formattedVendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
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
            Vendors Management
            <Sparkles className="size-6 text-[#FF7D44]" />
          </h2>
          <p className="text-xs font-semibold text-base-content/50 mt-1.5">
            Admin dashboard control panel for monitoring catering hosts, verifying approvals, and managing blocklists.
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
              placeholder="Search by vendor name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-base-200 h-11 rounded-2xl pl-11 pr-4 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 transition-all text-xs"
            />
          </div>
        </div>

        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 pr-2">
          {filteredUsers.length} Active Hosts
        </div>
      </motion.div>

      {/* Table Content */}
      <TableContent
        filteredUsers={filteredUsers}
        handleBlockUnblock={handleBlockUnblock}
        handleDrawerOpen={handleDrawerOpen}
      />

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

    </div>
  );
}

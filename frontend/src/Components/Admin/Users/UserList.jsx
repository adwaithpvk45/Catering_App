 
import React, { useEffect, useState } from "react";
import TableContent from "../../../common ui/Table";
import UserDetails from "./UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, toggleAccountStatusAction } from "../../../api/admin/adminActions";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, AlertCircle, Download, Filter } from "lucide-react";
import axios from "axios";
import appConfig from "../../../api/common/appConfig";
import toast from "react-hot-toast";
import { exportToCSV } from "../../../utils/csvExport";

const UsersList = () => {
  const dispatch = useDispatch();
  const { users, pagination } = useSelector((state) => state.admin);
  const userPagination = pagination?.users || { total: 0, page: 1, limit: 5, pages: 1 };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleDrawerOpen = (data) => {
    setSelectedUser(data);
    setDrawerOpen(true);
  };

  // Debounced search & fetch on page or filter change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(getUsers(page, 5, searchQuery, statusFilter));
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
        `${appConfig.baseURL}/api/admin/users?export=true&search=${encodeURIComponent(searchQuery)}&status=${statusFilter}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${appConfig.token}`
          }
        }
      );
      if (res.data.success) {
        const headers = ["User ID", "Name", "Email", "Status", "Role", "Created At"];
        const rows = res.data.users.map(u => [
          u._id,
          u.name || "Unknown User",
          u.email,
          u.status || "active",
          u.role || "user",
          u.createdAt ? dayjs(u.createdAt).format("YYYY-MM-DD HH:mm") : "N/A"
        ]);
        exportToCSV("Feastify_Users", headers, rows);
        toast.success("Users list exported successfully!");
      } else {
        toast.error("Failed to export users.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to export data.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleBlockUnblock = (id, action) => {
    const userToBlock = formattedUsers.find((u) => u.id === id);
    if (userToBlock) {
      setTargetUser({
        id,
        name: userToBlock.name,
        email: userToBlock.email,
        action,
      });
      setBlockConfirmOpen(true);
    }
  };

  const confirmBlockUnblock = () => {
    if (targetUser) {
      const nextStatus = targetUser.action === "block" ? "blocked" : "active";
      dispatch(toggleAccountStatusAction(targetUser.id, nextStatus, "user", page, 5, searchQuery, statusFilter));
      setBlockConfirmOpen(false);
      setTargetUser(null);
    }
  };

  const formattedUsers = users.map((user) => ({
    id: user._id,
    name: user.name || "Unknown User",
    email: user.email,
    status: user.status || "active",
    createdTime: dayjs(user.createdAt).format("YYYY-MM-DD"),
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
            Users Management
            <Users className="size-6 text-[#FF7D44]" />
          </h2>
          <p className="text-xs font-semibold text-base-content/50 mt-1.5">
            Admin dashboard control panel for monitoring client accounts, verification logs, and active statuses.
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
              placeholder="Search by name, email..."
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
            {userPagination.total} Total Clients
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <TableContent
        users={formattedUsers}
        pagination={userPagination}
        onPageChange={(newPage) => setPage(newPage)}
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
            user={"user"}
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
                {targetUser.action === "block" ? " This user will be immediately logged out and prevented from signing in." : " They will be allowed to log back in to their account."}
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
};

export default UsersList;
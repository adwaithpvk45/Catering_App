 
import React, { useEffect, useState } from "react";
import TableContent from "../../../common ui/Table";
import UserDetails from "./UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, toggleAccountStatusAction } from "../../../api/admin/adminActions";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, AlertCircle } from "lucide-react";

const UsersList = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

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
      dispatch(toggleAccountStatusAction(targetUser.id, nextStatus, "user"));
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

  const filteredUsers = formattedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-base-200 h-11 rounded-2xl pl-11 pr-4 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 transition-all text-xs"
            />
          </div>
        </div>

        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 pr-2">
          {filteredUsers.length} Active Clients
        </div>
      </motion.div>

      {/* Users Table */}
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
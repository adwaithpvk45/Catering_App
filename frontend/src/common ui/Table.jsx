import React, { useState, useEffect } from "react";
import { Eye, Ban, CheckCircle, AlertCircle } from "lucide-react";

export default function TableContent({ filteredUsers, handleBlockUnblock, handleDrawerOpen }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // Reset page to 0 when filtered list changes
  useEffect(() => {
    setPage(0);
  }, [filteredUsers]);

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-2xl overflow-hidden font-outfit select-none flex flex-col justify-between" style={{ height: 'calc(100vh - 280px)' }}>
      <div className="overflow-auto w-full h-full flex flex-col justify-between">
        <table className="table w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-base-200">
            <tr className="border-b border-base-content/10">
              <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Name</th>
              <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Email</th>
              <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Created Time</th>
              <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Status</th>
              <th className="py-5 px-6 text-center text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="border-b border-base-content/5 hover:bg-base-200/30 transition-colors duration-200"
                >
                  {/* Name */}
                  <td className="py-4 px-6 text-sm font-black text-base-content capitalize">{user.name}</td>
                  
                  {/* Email */}
                  <td className="py-4 px-6 text-xs font-bold text-base-content/70">{user.email}</td>
                  
                  {/* Created Time */}
                  <td className="py-4 px-6 text-xs font-bold text-base-content/70">{user.createdTime}</td>
                  
                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.status === 'active' 
                        ? 'bg-success/10 text-success border border-success/20' 
                        : 'bg-error/10 text-error border border-error/20'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleDrawerOpen(user)}
                        className="p-2 rounded-xl bg-base-200 hover:bg-warning hover:text-white text-base-content/60 transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="size-4" />
                      </button>

                      {user.status === "active" ? (
                        <button 
                          onClick={() => handleBlockUnblock(user.id, "block")}
                          className="p-2 rounded-xl bg-base-200 hover:bg-error hover:text-white text-base-content/60 transition-all cursor-pointer"
                          title="Block User"
                        >
                          <Ban className="size-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleBlockUnblock(user.id, "unblock")}
                          className="p-2 rounded-xl bg-base-200 hover:bg-success hover:text-white text-base-content/60 transition-all cursor-pointer"
                          title="Activate User"
                        >
                          <CheckCircle className="size-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 px-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="size-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-2">
                      <AlertCircle className="size-6" />
                    </div>
                    <h4 className="font-black text-lg text-base-content/70">No Records Found</h4>
                    <p className="text-xs font-semibold text-base-content/40 max-w-sm">
                      There are no registered accounts matching your filters.
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
            Showing {filteredUsers.length ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} records
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => ((p + 1) * rowsPerPage < filteredUsers.length ? p + 1 : p))}
              disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
              className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
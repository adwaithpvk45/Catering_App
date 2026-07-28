/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComplaints, updateStatus } from '../../../api/admin/adminActions';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Eye,
  Check,
  Search,
  AlertCircle,
  X,
  User,
  Mail,
  Activity,
  Sparkles,
} from 'lucide-react';
import axios from 'axios';
import appConfig from '../../../api/common/appConfig';
import toast from 'react-hot-toast';

const AdminComplaintsSection = () => {
  const dispatch = useDispatch();
  const { complaints } = useSelector((state) => state.admin) || [];

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [editedReply, setEditedReply] = useState("");

  useEffect(() => {
    dispatch(getComplaints()).finally(() => setLoading(false));
  }, [dispatch]);

  // Reset page to 0 when search changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';
    dispatch(updateStatus(id, newStatus));
  };

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setAiResult(null);
    setEditedReply("");
  };

  const handleClose = () => {
    setSelectedComplaint(null);
    setAiResult(null);
    setEditedReply("");
  };

  const handleGenerateAI = async (id) => {
    setAiLoading(true);
    try {
      const res = await axios.post(`${appConfig.baseURL}/api/admin/complaints/${id}/ai-assist`, {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${appConfig.token}`
        }
      });
      if (res.data.success) {
        setAiResult(res.data.analysis);
        setEditedReply(res.data.analysis.draftReply || "");
      } else {
        toast.error("Failed to generate AI reply.");
      }
    } catch (err) {
      console.error(err);
      toast.error("AI service is currently unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendAIResponse = async () => {
    if (!selectedComplaint) return;
    try {
      await dispatch(updateStatus(selectedComplaint._id, "Resolved", editedReply));
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComplaints = complaints.filter(c => 
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.subject || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedComplaints = filteredComplaints.slice(
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
            Complaints Management
            <MessageSquare className="size-6 text-[#FF7D44]" />
          </h2>
          <p className="text-xs font-semibold text-base-content/50 mt-1.5">
            Resolve support tickets, review user feedback, and manage complaints status.
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
              placeholder="Search by name, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-base-200 h-11 rounded-2xl pl-11 pr-4 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 transition-all text-xs"
            />
          </div>
        </div>

        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 pr-2">
          {filteredComplaints.length} Tickets Found
        </div>
      </motion.div>

      {/* Complaints Table */}
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
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Name</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Email</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Subject</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Status</th>
                <th className="py-5 px-6 text-center text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComplaints.length > 0 ? (
                paginatedComplaints.map((c, idx) => (
                  <motion.tr
                    key={c._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
                    className="border-b border-base-content/5 hover:bg-base-200/30 transition-colors duration-200"
                  >
                    {/* Name */}
                    <td className="py-4 px-6 text-sm font-black text-base-content capitalize">{c.name}</td>

                    {/* Email */}
                    <td className="py-4 px-6 text-xs font-bold text-base-content/70">{c.email}</td>

                    {/* Subject */}
                    <td className="py-4 px-6 text-xs font-bold text-base-content/70 truncate max-w-[200px]" title={c.subject}>
                      {c.subject}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          c.status === 'Resolved'
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-warning/10 text-warning border border-warning/20'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(c)}
                          className="p-2 rounded-xl bg-base-200 hover:bg-warning hover:text-white text-base-content/60 transition-all cursor-pointer"
                          title="View Ticket Details"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(c._id, c.status)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                            c.status === "Pending"
                              ? "bg-success/10 text-success border-success/20 hover:bg-success hover:text-white"
                              : "bg-warning/10 text-warning border-warning/20 hover:bg-warning hover:text-white"
                          }`}
                        >
                          Mark as {c.status === 'Pending' ? 'Resolved' : 'Pending'}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-2">
                        <AlertCircle className="size-6" />
                      </div>
                      <h4 className="font-black text-lg text-base-content/70">No Complaints Found</h4>
                      <p className="text-xs font-semibold text-base-content/40 max-w-sm">
                        All clear! There are no active complaints or support tickets in the database.
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
              Showing {filteredComplaints.length ? page * rowsPerPage + 1 : 0} to{" "}
              {Math.min((page + 1) * rowsPerPage, filteredComplaints.length)} of{" "}
              {filteredComplaints.length} complaints
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
                    (p + 1) * rowsPerPage < filteredComplaints.length ? p + 1 : p
                  )
                }
                disabled={(page + 1) * rowsPerPage >= filteredComplaints.length}
                className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Glassmorphic Complaint Details Dialog */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-4xl p-8 bg-base-100/95 backdrop-blur-md border border-base-content/10 rounded-3xl shadow-2xl font-outfit relative flex flex-col md:flex-row gap-8 transition-all duration-300 max-h-[90vh] overflow-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/60 hover:text-base-content transition-all cursor-pointer z-20"
              >
                <X className="size-5" />
              </button>

              {/* Left Column: Complaint Details */}
              <div className="flex-1 space-y-6">
                {/* Title Header */}
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center">
                    <MessageSquare className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-base-content">Complaint Details</h3>
                    <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider mt-0.5">Support Ticket Info</p>
                  </div>
                </div>

                <div className="w-full h-px bg-base-content/10"></div>

                {/* Grid Fields */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <User className="size-3" /> Name
                    </label>
                    <input
                      type="text"
                      value={selectedComplaint.name || "N/A"}
                      disabled
                      className="w-full bg-base-200 h-11 rounded-xl px-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <Mail className="size-3" /> Email
                    </label>
                    <input
                      type="text"
                      value={selectedComplaint.email || "N/A"}
                      disabled
                      className="w-full bg-base-200 h-11 rounded-xl px-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={selectedComplaint.subject || "N/A"}
                      disabled
                      className="w-full bg-base-200 h-11 rounded-xl px-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Message
                    </label>
                    <textarea
                      value={selectedComplaint.message || "N/A"}
                      disabled
                      rows={4}
                      className="w-full bg-base-200 rounded-xl p-4 border border-base-content/5 text-xs font-bold opacity-75 cursor-not-allowed text-base-content resize-none leading-relaxed"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 flex items-center gap-1">
                      <Activity className="size-3" /> Status
                    </label>
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          selectedComplaint.status === 'Resolved'
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-warning/10 text-warning border border-warning/20'
                        }`}
                      >
                        {selectedComplaint.status}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Close Button at bottom */}
                <div className="pt-2">
                  <button
                    onClick={handleClose}
                    className="w-full btn btn-warning h-12 rounded-xl text-white font-black text-sm shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    Close Ticket
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: AI Support Copilot Section */}
              <div className="flex-1 border-t md:border-t-0 md:border-l border-base-content/10 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-[#FF7D44]/15 text-[#FF7D44] flex items-center justify-center">
                        <Sparkles className="size-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-base-content">AI Support Copilot</h4>
                        <p className="text-[9px] font-black text-base-content/40 uppercase tracking-widest mt-0.5">Powered by Gemini AI</p>
                      </div>
                    </div>
                  </div>

                  {!aiResult && !aiLoading && (
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-base-200/50 rounded-2xl border border-dashed border-base-content/10 h-64">
                      <Sparkles className="size-10 text-[#FF7D44] opacity-40 mb-3 animate-pulse" />
                      <h5 className="font-black text-sm text-base-content/80">Need Assistance?</h5>
                      <p className="text-xs text-base-content/50 font-semibold max-w-[220px] mt-1 mb-4 leading-normal">
                        Generate a 1-sentence summary, sentiment analysis, and a professional reply draft.
                      </p>
                      <button
                        onClick={() => handleGenerateAI(selectedComplaint._id)}
                        className="btn btn-warning btn-sm rounded-xl text-white font-black text-xs px-5 shadow-lg shadow-orange-500/10 cursor-pointer"
                      >
                        ✨ Generate AI Assistant
                      </button>
                    </div>
                  )}

                  {aiLoading && (
                    <div className="flex flex-col justify-center gap-4 bg-base-200/30 rounded-2xl p-6 border border-base-content/5 h-64">
                      <div className="flex items-center gap-3">
                        <span className="loading loading-spinner loading-sm text-[#FF7D44]"></span>
                        <span className="text-xs font-black uppercase tracking-widest text-[#FF7D44] animate-pulse">AI is thinking...</span>
                      </div>
                      <div className="space-y-2 mt-2">
                        <div className="h-3 bg-base-content/10 rounded-full w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-base-content/10 rounded-full w-full animate-pulse"></div>
                        <div className="h-3 bg-base-content/10 rounded-full w-5/6 animate-pulse"></div>
                      </div>
                    </div>
                  )}

                  {aiResult && !aiLoading && (
                    <div className="space-y-4">
                      {/* Sentiment & Urgency Badges */}
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                          aiResult.urgency === 'High' 
                            ? 'bg-error/15 text-error border border-error/15' 
                            : aiResult.urgency === 'Medium'
                            ? 'bg-warning/15 text-warning border border-warning/15'
                            : 'bg-success/15 text-success border border-success/15'
                        }`}>
                          Urgency: {aiResult.urgency}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-info/15 text-info border border-info/15">
                          Sentiment: {aiResult.sentiment}
                        </span>
                      </div>

                      {/* Summary */}
                      <div className="bg-base-200/50 p-4 rounded-xl border border-base-content/5 text-xs font-semibold leading-relaxed text-base-content/85">
                        <strong className="text-base-content block text-[10px] font-black uppercase tracking-wider mb-1 opacity-55">AI Summary</strong>
                        {aiResult.summary}
                      </div>

                      {/* Draft Response Textarea */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                          AI Draft Response (Editable)
                        </label>
                        <textarea
                          value={editedReply}
                          onChange={(e) => setEditedReply(e.target.value)}
                          rows={6}
                          className="w-full bg-base-200 rounded-xl p-4 border border-base-content/5 text-xs font-bold leading-relaxed text-base-content outline-none focus:border-[#FF7D44]/30 transition-all resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Action footer */}
                <div className="pt-6 mt-4 border-t border-base-content/5 flex gap-3">
                  {aiResult ? (
                    <>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(editedReply);
                          toast.success("Response copied to clipboard!");
                        }}
                        className="btn btn-ghost border border-base-content/10 rounded-xl text-xs font-black px-4 cursor-pointer"
                      >
                        Copy Draft
                      </button>
                      <button
                        onClick={handleSendAIResponse}
                        className="flex-1 btn btn-warning text-white rounded-xl text-xs font-black shadow-xl shadow-orange-500/10 cursor-pointer flex items-center justify-center gap-2"
                      >
                        Resolve & Send AI Reply
                        <Check className="size-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      disabled
                      className="w-full btn btn-warning btn-disabled rounded-xl text-xs font-black flex items-center justify-center gap-2"
                    >
                      Draft Reply Locked
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminComplaintsSection;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserComplaints, createComplaintAction } from '../../api/user/userActions';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Calendar, Clock, CheckCircle2, AlertCircle, LifeBuoy, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerComplaints = () => {
  const dispatch = useDispatch();
  const complaints = useSelector((state) => state.user.complaints);
  
  // Get active user data for auto-filling the form
  const localData = JSON.parse(localStorage.getItem("userDetails")) || {};
  const user = localData?.existingUser || {};

  // Form State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getUserComplaints());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    const payload = {
      userId: user._id,
      fullName: user.name || "Anonymous Customer",
      email: user.email || "no-email@example.com",
      subject,
      message,
    };

    const res = await dispatch(createComplaintAction(payload));
    setLoading(false);

    if (res) {
      setSubject("");
      setMessage("");
      // Refresh the historical ticket list
      dispatch(getUserComplaints());
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Resolved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-success/10 text-success border border-success/20">
          <CheckCircle2 className="size-3.5" />
          Resolved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-warning/10 text-warning border border-warning/20">
        <Clock className="size-3.5 animate-pulse" />
        Pending
      </span>
    );
  };

  return (
    <div className="w-full py-1">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          Support & Feedback
          <LifeBuoy className="size-6 text-[#FF7D44]" />
        </h2>
        <p className="text-sm text-base-content/50 font-medium mt-1">
          Have an issue with an order? Submit a ticket below, and our administration team will get back to you immediately.
        </p>
      </motion.div>

      {/* Main Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Submit a new Ticket Form */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-4 bg-base-100 rounded-[2rem] border border-base-content/10 shadow-2xl p-8 relative overflow-hidden"
          style={{ height: 'calc(100vh - 280px)' }}
        >
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 size-32 bg-[#FF7D44]/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
          
          <div className="relative h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                File a Support Ticket
                <Sparkles className="size-4 text-[#FF7D44] animate-pulse" />
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Auto-fill Fields Info */}
                <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-content/5 text-xs space-y-1 opacity-60">
                  <div>
                    <span className="font-black">Submitting as:</span> {user.name}
                  </div>
                  <div>
                    <span className="font-black">Registered Email:</span> {user.email}
                  </div>
                </div>
  
                {/* Subject Input */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Ticket Subject</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                    <input 
                      type="text" 
                      placeholder="e.g. Catering Date Delay" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-base-200 h-12 rounded-xl pl-12 pr-4 font-bold outline-none border-2 border-transparent focus:border-[#FF7D44]/30 transition-all text-sm"
                      required
                    />
                  </div>
                </div>
  
                {/* Message Input */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Describe the Issue</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide all relevant booking details..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-base-200 rounded-xl p-4 font-bold outline-none border-2 border-transparent focus:border-[#FF7D44]/30 transition-all text-sm leading-relaxed resize-none"
                    required
                  />
                </div>
              </form>
            </div>
  
            {/* Submit Button aligned at the bottom */}
            <div className="mt-4">
              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full btn btn-warning h-12 rounded-xl text-white font-black text-sm shadow-xl shadow-orange-500/10 group flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    Submit Ticket
                    <Send className="size-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
  
        {/* Right Side: Historical Complaints Table */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-8 bg-base-100 rounded-[2rem] border border-base-content/10 shadow-2xl overflow-hidden"
          style={{ height: 'calc(100vh - 357px)' }}
        >
          <div className="overflow-auto w-full h-full">
            <table className="table w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-base-200">
                <tr className="border-b border-base-content/10">
                  <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Subject</th>
                  <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Detailed Message</th>
                  <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Date Filed</th>
                  <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints && complaints.length > 0 ? (
                  complaints.map((complaint, idx) => (
                    <motion.tr 
                      key={complaint._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 + (idx * 0.05) }}
                      className="border-b border-base-content/5 hover:bg-base-200/30 transition-colors duration-200"
                    >
                      {/* Subject */}
                      <td className="py-5 px-6">
                        <div className="font-black text-sm text-base-content leading-tight max-w-[150px] truncate">
                          {complaint.subject}
                        </div>
                      </td>

                      {/* Message body */}
                      <td className="py-5 px-6 text-xs font-semibold text-base-content/60 max-w-xs leading-relaxed">
                        <p className="line-clamp-2">{complaint.message}</p>
                      </td>

                      {/* Date Submitted */}
                      <td className="py-5 px-6 text-xs font-bold text-base-content/70">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-3.5 opacity-40 text-[#FF7D44]" />
                          <span>
                            {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-5 px-6">
                        {getStatusBadge(complaint.status)}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 px-6 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="size-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-2">
                          <AlertCircle className="size-6" />
                        </div>
                        <h4 className="font-black text-lg text-base-content/70">No Tickets Filed</h4>
                        <p className="text-xs font-semibold text-base-content/40 max-w-sm">
                          You currently do not have any open support issues. If you experience booking discrepancies or catering problems, file a ticket on the left panel!
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CustomerComplaints;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings, createRazorpayOrderAction, verifyRazorpayPaymentAction } from '../../api/user/userActions';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, UtensilsCrossed, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVendorBrandName, getServiceIdByVendorDbId } from '../../store/data';

const CustomerBookings = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.user.Booking);

  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

  console.log("CustomerBookings: bookings =", bookings);

  const [checkoutBooking, setCheckoutBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Dynamically load Razorpay SDK script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getCheckoutDetails = (booking) => {
    if (!booking) return { total: 0, advance: 0, balance: 0, pricePerHead: 0 };
    const pricePerHead = booking.services?.[0]?.priceAtBooking || parseFloat(booking.price) || 0;
    const guestCount = booking.guestCount || 0;
    const total = pricePerHead * guestCount;
    const advance = total * 0.5;
    const balance = total * 0.5;
    return { total, advance, balance, pricePerHead };
  };

  const handleConfirmPayment = async (bookingId) => {
    setIsProcessing(true);
    try {
      const res = await dispatch(createRazorpayOrderAction(bookingId));
      if (!res || !res.success) {
        throw new Error(res?.message || "Failed to initiate Razorpay Order");
      }

      const { orderId, amount, currency, key } = res;
      const localData = JSON.parse(localStorage.getItem("userDetails")) || {};
      const user = localData.existingUser || {};

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Feastify Catering",
        description: "50% Advance Booking Deposit",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
        order_id: orderId,
        handler: async function (response) {
          setIsProcessing(true);
          try {
            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await dispatch(verifyRazorpayPaymentAction(bookingId, verificationPayload));
            if (verifyRes && verifyRes.success) {
              setCheckoutBooking(null);
              dispatch(getUserBookings());
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#FF7D44",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay payment initialization failed:", err);
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status, booking) => {
    switch (status) {
      case 'Confirmed':
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-success/10 text-success border border-success/20">
              <CheckCircle2 className="size-3.5" />
              Confirmed
            </span>
            <span className="text-[10px] font-bold text-success/80 ml-1">
              {booking.paymentStatus === 'Fully Paid' ? 'Fully Paid' : 'Advance Paid'}
            </span>
          </div>
        );
      case 'Accepted':
        if (booking.paymentStatus === 'Unpaid' || !booking.paymentStatus) {
          const pricePerHead = booking.services?.[0]?.priceAtBooking || parseFloat(booking.price) || 0;
          const total = pricePerHead * (booking.guestCount || 0);
          const advance = total * 0.5;
          return (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-info/10 text-info border border-info/20">
                Awaiting Advance
              </span>
              <button
                onClick={() => setCheckoutBooking(booking)}
                className="px-3.5 py-2 bg-[#FF7D44] hover:bg-[#e06633] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Pay Deposit (₹{advance.toLocaleString()})
              </button>
            </div>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-success/10 text-success border border-success/20">
            <CheckCircle2 className="size-3.5" />
            Accepted
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-error/10 text-error border border-error/20">
            <XCircle className="size-3.5" />
            Cancelled
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-warning/10 text-warning border border-warning/20">
            <Clock className="size-3.5" />
            Pending
          </span>
        );
    }
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
          My Event Bookings
          <UtensilsCrossed className="size-6 text-[#FF7D44]" />
        </h2>
        <p className="text-sm text-base-content/50 font-medium mt-1">
          Keep track of your active catering orders, verify vendor verification, and track scheduling details.
        </p>
      </motion.div>

      {/* Bookings List/Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-2xl overflow-hidden"
        style={{ height: 'calc(100vh - 280px)' }}
      >
        <div className="overflow-auto w-full h-full">
          <table className="table w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-base-200">
              <tr className="border-b border-base-content/10">
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Catering Provider</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Event Date</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Venue Location</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Guests</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings && bookings.length > 0 ? (
                bookings.map((booking, idx) => (
                  <motion.tr 
                    key={booking._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + (idx * 0.05) }}
                    className="border-b border-base-content/5 hover:bg-base-200/30 transition-colors duration-200"
                  >
                    {/* Vendor Column */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-base-200 overflow-hidden flex items-center justify-center border border-[#FF7D44]/20 shadow-sm">
                          {booking.vendor && booking.vendor.length > 0 && booking.vendor[0]?.profilePic ? (
                            <img src={booking.vendor[0].profilePic} alt="Vendor" className="size-full object-cover" />
                          ) : (
                            <UtensilsCrossed className="size-5 text-[#FF7D44]" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-sm text-base-content leading-tight">
                            {booking.vendor && booking.vendor.length > 0 && typeof booking.vendor[0] === 'object' ? (
                              (() => {
                                const brandName = getVendorBrandName(booking.vendor[0]._id);
                                const serviceId = getServiceIdByVendorDbId(booking.vendor[0]._id);
                                return serviceId ? (
                                  <Link to={`/food/${serviceId}`} className="hover:text-[#FF7D44] hover:underline transition-colors">
                                    {brandName}
                                  </Link>
                                ) : (
                                  brandName
                                );
                              })()
                            ) : (
                              "Unknown Vendor"
                            )}
                          </div>
                          <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-0.5">
                            {booking.vendor && booking.vendor.length > 0 && typeof booking.vendor[0] === 'object' && booking.vendor[0].name
                              ? `Verified Partner • ${booking.vendor[0].name}`
                              : "Verified Partner"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="py-5 px-6 text-sm font-bold text-base-content/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 opacity-40 text-[#FF7D44]" />
                        <span>
                          {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Venue Location Column */}
                    <td className="py-5 px-6 text-sm font-bold text-base-content/80">
                      <div className="flex items-center gap-2 max-w-xs truncate">
                        <MapPin className="size-4 opacity-40 text-[#FF7D44]" />
                        <span>{booking.venueLocation || "TBD"}</span>
                      </div>
                    </td>

                    {/* Guests Column */}
                    <td className="py-5 px-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="bg-base-200/80 px-3 py-1 rounded-lg border border-base-content/5 font-black text-xs flex items-center gap-1.5">
                          <Users className="size-3.5 opacity-50" />
                          <span>{booking.guestCount || "-"} guests</span>
                        </div>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-5 px-6">
                      {getStatusBadge(booking.status, booking)}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-2">
                        <AlertCircle className="size-6" />
                      </div>
                      <h4 className="font-black text-lg text-base-content/70">No Bookings Found</h4>
                      <p className="text-xs font-semibold text-base-content/40 max-w-sm">
                        You have not placed any catering requests yet. Browse our verified menus and find the perfect host for your events!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Checkout Payment Modal */}
      {checkoutBooking && (() => {
        const { total, advance, balance, pricePerHead } = getCheckoutDetails(checkoutBooking);
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-outfit">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-base-100 border border-base-content/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative space-y-6"
            >
              {/* Close button */}
              <button 
                onClick={() => setCheckoutBooking(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
              >
                <XCircle className="size-5 opacity-60 text-base-content" />
              </button>

              {/* Title */}
              <div>
                <h3 className="text-xl font-black tracking-tight text-base-content leading-none">Confirm & Pay Deposit</h3>
                <p className="text-xs font-semibold text-base-content/50 mt-1">Pay 50% booking advance to confirm your catering package.</p>
              </div>

              <div className="w-full h-px bg-base-content/10"></div>

              {/* Booking Summary Card */}
              <div className="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 space-y-3">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="opacity-50">Provider:</span>
                  <span className="text-base-content">
                    {checkoutBooking.vendor?.[0]
                      ? `${getVendorBrandName(checkoutBooking.vendor[0]._id)} (${checkoutBooking.vendor[0].name})`
                      : "Catering Provider"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="opacity-50">Guests Count:</span>
                  <span className="text-base-content">{checkoutBooking.guestCount} guests (₹{pricePerHead}/head)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="opacity-50">Total Amount:</span>
                  <span className="text-base-content text-[#FF7D44]">₹{total.toLocaleString()}</span>
                </div>
                <div className="w-full h-px bg-base-content/5"></div>
                <div className="flex justify-between items-center text-xs font-black pt-1">
                  <span className="text-success">50% Advance (Due Now):</span>
                  <span className="text-success text-sm font-black">₹{advance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="opacity-50">Remaining Balance (Due at Venue):</span>
                  <span className="text-base-content/75">₹{balance.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Info Badging */}
              <div className="flex flex-col items-center justify-center p-6 bg-base-200/50 rounded-2xl border border-dashed border-base-content/10 gap-3 text-center">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7D44]">Razorpay Secured Gateway</span>
                </div>
                <p className="text-xs text-base-content/60 font-semibold max-w-sm">
                  Feastify supports safe, instant, and PCI-compliant transfers via Razorpay. Pay the advance deposit easily using **UPI, Cards, Netbanking, or Wallets**.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => setCheckoutBooking(null)}
                  className="flex-1 btn btn-ghost h-12 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleConfirmPayment(checkoutBooking._id)}
                  className="flex-1 btn btn-warning h-12 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/10 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    `Pay Deposit (₹${advance.toLocaleString()})`
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        );
      })()}
    </div>
  );
};

export default CustomerBookings;

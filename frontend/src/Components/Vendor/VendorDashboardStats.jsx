 
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVendorStats } from '../../api/vendor/vendorActions';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/useThemeStore';
import { 
  UtensilsCrossed, 
  CalendarCheck, 
  IndianRupee, 
  Layers, 
  Clock, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Award
} from 'lucide-react';

function VendorDashboardStats() {
  const dispatch = useDispatch();
  const { stats, errors } = useSelector((state) => state.vendor);
  const { theme } = useThemeStore();

  // Get current user details from local storage
  const localData = JSON.parse(localStorage.getItem("userDetails")) || {};
  const user = localData?.existingUser || {};

  useEffect(() => {
    dispatch(getVendorStats());
  }, [dispatch]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const textColor = theme === 'dark' ? '#f3f4f6' : '#1f2937';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  const tooltipTheme = theme === 'dark' ? 'dark' : 'light';

  const trendChartConfig = useMemo(() => ({
    options: {
      chart: {
        id: "booking-trends",
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Outfit, sans-serif',
      },
      colors: ["#FF7D44"],
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        categories: stats?.monthlyBookingTrends?.map((t) => t.month) || [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: textColor,
            opacity: 0.7,
            fontWeight: 700,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: textColor,
            opacity: 0.7,
            fontWeight: 700,
          },
        },
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
      },
      dataLabels: { enabled: false },
      tooltip: { theme: tooltipTheme },
    },
    series: [
      {
        name: "Bookings",
        data: stats?.monthlyBookingTrends?.map((t) => t.bookings) || [],
      },
    ],
  }), [stats?.monthlyBookingTrends, textColor, gridColor, tooltipTheme]);

  const donutChartConfig = useMemo(() => ({
    options: {
      chart: {
        id: "category-distribution",
        fontFamily: 'Outfit, sans-serif',
      },
      labels: stats?.categoryStats?.map((t) => t.category) || [],
      colors: ['#FF7D44', '#FFA37A', '#FFC2A8', '#FFE1D4', '#FFF0EA'], // Reduced color monochromatic brand palette
      legend: {
        position: "bottom",
        labels: {
          colors: textColor,
          useSeriesColors: false,
        },
        itemMargin: { horizontal: 10, vertical: 5 },
      },
      stroke: { show: false },
      dataLabels: {
        enabled: true,
        style: {
          fontWeight: 900,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total Bookings",
                color: textColor,
                formatter: () => stats?.totalBookings || 0,
              },
              value: {
                color: textColor,
                fontWeight: 900,
              },
            },
          },
        },
      },
      tooltip: { theme: tooltipTheme },
    },
    series: stats?.categoryStats?.map((t) => t.count) || [],
  }), [stats?.categoryStats, stats?.totalBookings, textColor, tooltipTheme]);

  const hasStats = stats && !errors;
  const bookingSuccessRate = stats?.totalBookings 
    ? ((stats.acceptedBookings / stats.totalBookings) * 100).toFixed(0)
    : 0;

  return (
    <div className="py-6 px-1 max-w-full font-outfit select-none space-y-8">
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-2xl p-8 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="absolute top-0 right-0 size-36 bg-[#FF7D44]/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center shadow-inner">
            <Award className="size-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-base-content leading-tight capitalize">
              Welcome back, {user.name || "Chef"}!
            </h2>
            <p className="text-xs font-semibold text-base-content/50 mt-1">
              Here is your catering hub performance and operations health overview.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-success/10 text-success border border-success/20 uppercase tracking-wider">
          <span className="size-2 rounded-full bg-success animate-ping"></span>
          Terminal Live
        </span>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-xl p-6 relative overflow-hidden group hover:border-[#FF7D44]/20 transition-all"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Gross Revenue</span>
            <div className="size-9 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center">
              <IndianRupee className="size-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-base-content mb-1">
            {hasStats ? formatCurrency(stats.totalRevenue) : "₹0"}
          </div>
          <span className="text-[10px] font-bold text-success flex items-center gap-1">
            <TrendingUp className="size-3.5" /> Approved Bookings Earnings
          </span>
        </motion.div>

        {/* Stat 2: Total Bookings Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-xl p-6 relative overflow-hidden group hover:border-[#FF7D44]/20 transition-all"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Bookings Count</span>
            <div className="size-9 rounded-xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center">
              <CalendarCheck className="size-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-base-content mb-2">
            {hasStats ? stats.totalBookings : 0} <span className="text-xs font-semibold opacity-40">total</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] font-black text-warning flex items-center gap-1">
              <Clock className="size-3" /> {stats?.pendingBookings || 0} Pend
            </span>
            <span className="text-[10px] font-black text-success flex items-center gap-1">
              <CheckCircle2 className="size-3" /> {stats?.acceptedBookings || 0} Acc
            </span>
            <span className="text-[10px] font-black text-error flex items-center gap-1">
              <XCircle className="size-3" /> {stats?.cancelledBookings || 0} Can
            </span>
          </div>
        </motion.div>

        {/* Stat 3: My Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-xl p-6 relative overflow-hidden group hover:border-[#FF7D44]/20 transition-all"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">My Services</span>
            <div className="size-9 rounded-xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center">
              <Layers className="size-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-base-content mb-1">
            {hasStats ? stats.totalServices : 0}
          </div>
          <span className="text-[10px] font-bold opacity-45">Offered Catering Packages</span>
        </motion.div>

        {/* Stat 4: Booking Success Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-xl p-6 relative overflow-hidden group hover:border-[#FF7D44]/20 transition-all"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Approval Rating</span>
            <div className="size-9 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-base-content mb-2">
            {bookingSuccessRate}%
          </div>
          <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-success h-full transition-all duration-500"
              style={{ width: `${bookingSuccessRate}%` }}
            ></div>
          </div>
        </motion.div>

      </div>

      {/* Analytics Charts section */}
      {hasStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Monthly Booking Trends */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-2xl p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-black text-base-content">Booking Trends</h3>
              <p className="text-xs font-semibold text-base-content/40 mt-1">Number of orders received over the last 6 months.</p>
            </div>
            <div className="mt-6">
              <Chart 
                options={trendChartConfig.options} 
                series={trendChartConfig.series} 
                type="area" 
                height={280} 
              />
            </div>
          </motion.div>

          {/* Chart 2: Category Distribution */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-2xl p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-black text-base-content">Category Share</h3>
              <p className="text-xs font-semibold text-base-content/40 mt-1">Popularity and distribution of menu item categories.</p>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-[320px]">
                <Chart 
                  options={donutChartConfig.options} 
                  series={donutChartConfig.series} 
                  type="donut" 
                  height={280} 
                />
              </div>
            </div>
          </motion.div>

        </div>
      )}

      {errors && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-3 text-error">
          <XCircle className="size-5" />
          <span className="text-xs font-black">
            Failed to load stats: {errors.message || "Unknown server error"}
          </span>
        </div>
      )}

    </div>
  );
}

export default VendorDashboardStats;

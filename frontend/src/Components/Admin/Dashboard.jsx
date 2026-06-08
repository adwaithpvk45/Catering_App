 
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStats } from '../../api/admin/adminActions';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import ApexCharts from "react-apexcharts";
import { useThemeStore } from '../../store/useThemeStore';
import {
  Users,
  Briefcase,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const monthlyBookings = [
  { month: "Jan", bookings: 40 },
  { month: "Feb", bookings: 30 },
  { month: "Mar", bookings: 60 },
  { month: "Apr", bookings: 80 },
  { month: "May", bookings: 75 },
];

const serviceCategoryData = [
  { name: "Weddings", value: 400 },
  { name: "Birthdays", value: 300 },
  { name: "Corporate", value: 200 },
  { name: "Others", value: 100 },
];

// Isolated Clock component to prevent parent Dashboard from re-rendering every second
const ClockWidget = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 bg-base-200 border border-base-content/10 rounded-2xl shadow-inner font-bold text-xs">
      <Clock className="size-4 text-[#FF7D44]" />
      <span className="text-base-content/80">
        {currentTime.format('dddd, MMMM D, YYYY - hh:mm:ss A')}
      </span>
    </div>
  );
};

function Dashboard() {
  const dispatch = useDispatch();
  const { stats: realStats } = useSelector((state) => state.admin);
  const { theme } = useThemeStore();

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  const stats = [
    { 
      label: "Total Users", 
      value: realStats?.totalUsers || 0, 
      icon: <Users className="size-6 text-[#FF7D44]" />,
      colorClass: "from-[#FF7D44]/20 to-[#FF7D44]/5 border-[#FF7D44]/30"
    },
    { 
      label: "Total Vendors", 
      value: realStats?.totalVendors || 0, 
      icon: <ShieldCheck className="size-6 text-[#a855f7]" />,
      colorClass: "from-[#a855f7]/20 to-[#a855f7]/5 border-[#a855f7]/30"
    },
    { 
      label: "Total Bookings", 
      value: realStats?.totalBookings || 0, 
      icon: <Briefcase className="size-6 text-[#22c55e]" />,
      colorClass: "from-[#22c55e]/20 to-[#22c55e]/5 border-[#22c55e]/30"
    },
    { 
      label: "Complaints Filed", 
      value: realStats?.totalComplaints || 0, 
      icon: <AlertCircle className="size-6 text-[#ef4444]" />,
      colorClass: "from-[#ef4444]/20 to-[#ef4444]/5 border-[#ef4444]/30"
    },
  ];

  const textColor = theme === 'dark' ? '#f3f4f6' : '#1f2937';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  const tooltipTheme = theme === 'dark' ? 'dark' : 'light';

  const lineChartsOptions = useMemo(() => ({
    chart: {
      id: "monthly-bookings",
      type: "area",
      background: "transparent",
      toolbar: { show: false },
      sparkline: { enabled: false },
      fontFamily: 'Outfit, sans-serif',
    },
    colors: ["#FF7D44"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
    },
    xaxis: {
      categories: monthlyBookings.map((item) => item.month),
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
    dataLabels: { enabled: false },
    tooltip: { theme: tooltipTheme },
  }), [textColor, gridColor, tooltipTheme]);

  const lineChartSeries = [{
    name: "Bookings",
    data: monthlyBookings.map((item) => item.bookings)
  }];

  const donutChatOptions = useMemo(() => ({
    chart: {
      id: "service-distribution",
      type: 'donut',
      background: "transparent",
      fontFamily: 'Outfit, sans-serif',
    },
    stroke: { show: false }, // Removes the white border around donut slices
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              fontWeight: 'bold',
              color: textColor,
            },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: '900',
              color: textColor,
            },
            total: {
              show: true,
              label: 'Total',
              formatter: () => '1,000',
              color: textColor,
            }
          }
        }
      }
    },
    labels: serviceCategoryData.map((item) => item.name),
    colors: ['#FF7D44', '#FFA37A', '#FFC2A8', '#FFE1D4'], // Reduced color monochromatic brand palette
    legend: {
      position: 'bottom',
      labels: {
        colors: textColor,
      },
      fontFamily: 'Outfit',
      fontWeight: 'bold',
    },
    dataLabels: { enabled: false },
    tooltip: { theme: tooltipTheme },
  }), [textColor, tooltipTheme]);

  const donutChatSeries = serviceCategoryData.map((item) => item.value);

  return (
    <div className="py-6 px-1 max-w-full font-outfit select-none space-y-8">
      
      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-content/10 shadow-lg"
      >
        <div>
          <h2 className="text-2xl font-black text-base-content tracking-tight leading-none flex items-center gap-2">
            Admin Dashboard
            <Sparkles className="size-6 text-[#FF7D44] animate-pulse" />
          </h2>
          <p className="text-xs font-semibold text-base-content/50 mt-1.5">
            Monitor users activity, manage vendor applications, track reservations, and solve support tickets.
          </p>
        </div>

        {/* Real-time Clock Component */}
        <ClockWidget />
      </motion.div>

      {/* Grid for Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`p-6 bg-gradient-to-br ${item.colorClass} border rounded-[2.5rem] shadow-xl flex items-center justify-between hover:scale-[1.02] transition-transform duration-300 cursor-default`}
          >
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
                {item.label}
              </div>
              <div className="text-3xl font-black text-base-content mt-1 leading-none">
                {item.value}
              </div>
            </div>
            <div className="size-12 rounded-2xl bg-base-100 flex items-center justify-center border border-base-content/5 shadow-inner">
              {item.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Bookings Area Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 p-6 bg-base-100 border border-base-content/10 rounded-[2.5rem] shadow-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <h3 className="font-black text-base text-base-content flex items-center gap-2">
                Monthly Bookings Trend
                <TrendingUp className="size-4.5 text-[#FF7D44]" />
              </h3>
              <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider mt-0.5">Overall reservations metrics</p>
            </div>
          </div>
          <div className="w-full">
            <ApexCharts options={lineChartsOptions} series={lineChartSeries} type="area" height={280} />
          </div>
        </motion.div>

        {/* Service Booking Share Donut Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="lg:col-span-1 p-6 bg-base-100 border border-base-content/10 rounded-[2.5rem] shadow-2xl flex flex-col justify-between"
        >
          <div className="mb-4 px-2">
            <h3 className="font-black text-base text-base-content">
              Service Distribution
            </h3>
            <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider mt-0.5">Bookings split by event category</p>
          </div>
          <div className="w-full flex items-center justify-center py-4">
            <div className="w-full max-w-[320px]">
              <ApexCharts options={donutChatOptions} series={donutChatSeries} type="donut" height={280} />
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
}

export default Dashboard;
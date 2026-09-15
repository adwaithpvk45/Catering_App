import React, { useState } from "react";
import { 
  Sparkles, 
  IndianRupee, 
  Users, 
  Calendar, 
  Utensils, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  Award, 
  Flame, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import appConfig from "../api/common/appConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BudgetPlannerPage = () => {
  const [totalBudget, setTotalBudget] = useState(75000);
  const [guestCount, setGuestCount] = useState(150);
  const [eventType, setEventType] = useState("Wedding");
  const [dietaryPreference, setDietaryPreference] = useState("Both");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState(null);
  const [perHeadBudget, setPerHeadBudget] = useState(null);

  const navigate = useNavigate();

  const budgetPresets = [30000, 50000, 75000, 120000, 200000];
  const eventTypes = ["Wedding", "Birthday", "Corporate", "Anniversary", "Housewarming"];

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    if (!totalBudget || totalBudget <= 0 || !guestCount || guestCount <= 0) {
      toast.error("Please enter a valid budget and guest count");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${appConfig.baseURL}/api/ai/budget-planner`, {
        totalBudget,
        guestCount,
        eventType,
        dietaryPreference
      });

      if (response.data.success) {
        setPlans(response.data.plans);
        setPerHeadBudget(response.data.perHeadBudget);
        toast.success("Optimal catering plans calculated!");
      } else {
        toast.error("Could not calculate budget plan. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate budget plans. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#FF7D44] via-[#ff976a] to-[#ffb088] p-8 sm:p-12 text-white shadow-2xl">
          <div className="absolute -right-10 -bottom-10 size-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-black tracking-wider uppercase">
              <Sparkles className="size-4 animate-pulse" />
              Powered by Groq AI & Real Market Prices
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Smart AI Budget Planner
            </h1>
            <p className="text-sm sm:text-base font-semibold text-white/90 leading-relaxed">
              Enter your total event budget and guest count. Our AI instantly matches live caterer prices and dish menus to deliver 3 perfectly optimized party packages!
            </p>
          </div>
        </div>

        {/* Input Controls Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-200/50 backdrop-blur-xl border border-base-content/10 rounded-[2.5rem] p-6 sm:p-10 shadow-xl"
        >
          <form onSubmit={handleCalculate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Total Budget Input */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                  <IndianRupee className="size-4 text-[#FF7D44]" />
                  Total Budget (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-[#FF7D44]">₹</span>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    placeholder="75000"
                    className="w-full bg-base-100 pl-10 pr-4 py-4 rounded-2xl border border-base-content/10 focus:border-[#FF7D44] outline-none font-black text-xl text-base-content transition-all shadow-inner"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {budgetPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTotalBudget(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        totalBudget === preset
                          ? "bg-[#FF7D44] text-white shadow-md"
                          : "bg-base-100 border border-base-content/10 hover:border-[#FF7D44]/50"
                      }`}
                    >
                      ₹{preset.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Count Input & Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                    <Users className="size-4 text-[#FF7D44]" />
                    Estimated Guests
                  </label>
                  <span className="text-base font-black text-[#FF7D44] bg-[#FF7D44]/10 px-3 py-1 rounded-xl">
                    {guestCount} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-[#FF7D44] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold opacity-50">
                  <span>20 Guests</span>
                  <span>500 Guests</span>
                  <span>1000+ Guests</span>
                </div>
              </div>

              {/* Event Type Selection */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                  <Calendar className="size-4 text-[#FF7D44]" />
                  Event Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                        eventType === type
                          ? "bg-[#FF7D44] text-white border-transparent shadow-lg shadow-orange-500/20"
                          : "bg-base-100 border-base-content/10 hover:border-[#FF7D44]/40"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Preference */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                  <Utensils className="size-4 text-[#FF7D44]" />
                  Dietary Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Veg", "Non-Veg", "Both"].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setDietaryPreference(pref)}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                        dietaryPreference === pref
                          ? "bg-[#FF7D44] text-white border-transparent shadow-lg shadow-orange-500/20"
                          : "bg-base-100 border-base-content/10 hover:border-[#FF7D44]/40"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Target Math Summary Banner */}
            <div className="p-4 rounded-2xl bg-base-100 border border-base-content/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center font-black">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-base-content/60">Target Per-Plate Budget</div>
                  <div className="text-lg font-black text-[#FF7D44]">
                    ₹{Math.round(totalBudget / (guestCount || 1))}/plate
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF7D44] to-[#ff976a] hover:from-[#ff6b2a] hover:to-[#ff8d58] text-white font-black text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating Optimal Plans...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Generate Optimal AI Packages
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results Cards Display */}
        {plans && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Recommended AI Package Tiers</h2>
                <p className="text-xs font-semibold opacity-60">Generated matching live MongoDB caterer rates</p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#FF7D44]/10 text-[#FF7D44] text-xs font-black">
                3 Optimal Options
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {plans.map((plan, idx) => {
                const isRecommended = idx === 1;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -6 }}
                    className={`relative rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between border transition-all ${
                      isRecommended
                        ? "bg-base-100 border-[#FF7D44] shadow-2xl ring-2 ring-[#FF7D44]/30"
                        : "bg-base-100 border-base-content/10 shadow-xl"
                    }`}
                  >
                    {isRecommended && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF7D44] text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Flame className="size-3" />
                        Best Value Match
                      </div>
                    )}

                    <div className="space-y-6">
                      {/* Header */}
                      <div className="border-b border-base-content/5 pb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7D44]">
                          Option 0{idx + 1}
                        </span>
                        <h3 className="text-xl font-black tracking-tight text-base-content mt-1">
                          {plan.tier}
                        </h3>
                        <p className="text-xs font-semibold text-base-content/60 mt-1">
                          {plan.tagline}
                        </p>
                      </div>

                      {/* Pricing Big Badge */}
                      <div className="p-4 rounded-2xl bg-base-200/50 border border-base-content/5 space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold opacity-60">Price / Plate:</span>
                          <span className="text-xl font-black text-[#FF7D44]">
                            ₹{plan.pricePerPlate}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold opacity-60">Total Estimated Cost:</span>
                          <span className="text-sm font-black text-base-content">
                            ₹{plan.totalCost?.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Caterer & Service Info */}
                      <div className="space-y-2 text-xs font-semibold">
                        <div className="flex items-center justify-between">
                          <span className="opacity-60">Matching Caterer:</span>
                          <span className="font-black text-base-content">{plan.catererName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="opacity-60">Package Name:</span>
                          <span className="font-bold text-[#FF7D44]">{plan.packageName}</span>
                        </div>
                      </div>

                      {/* Menu Breakdown */}
                      <div className="space-y-3">
                        <div className="text-xs font-black uppercase tracking-wider text-base-content/80">
                          Included Menu Items
                        </div>

                        {/* Starters */}
                        {plan.starters?.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-[#FF7D44] uppercase">Starters:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {plan.starters.map((item, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-lg bg-base-200 text-[10px] font-bold text-base-content/80">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mains */}
                        {plan.mains?.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-[#FF7D44] uppercase">Main Course:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {plan.mains.map((item, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-lg bg-base-200 text-[10px] font-bold text-base-content/80">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Desserts */}
                        {plan.desserts?.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-[#FF7D44] uppercase">Desserts:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {plan.desserts.map((item, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-lg bg-base-200 text-[10px] font-bold text-base-content/80">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Why it fits rationale */}
                      {plan.whyItFits && (
                        <div className="p-3 rounded-xl bg-[#FF7D44]/5 border border-[#FF7D44]/10 text-xs font-medium text-base-content/80">
                          <span className="font-bold text-[#FF7D44]">Why it fits: </span>
                          {plan.whyItFits}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        if (plan.serviceId) {
                          navigate(`/food/${plan.serviceId}`);
                        } else {
                          navigate("/services");
                        }
                      }}
                      className={`w-full mt-6 py-3.5 rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isRecommended
                          ? "bg-[#FF7D44] hover:bg-[#e66a35] text-white shadow-orange-500/20"
                          : "bg-base-200 hover:bg-base-300 text-base-content"
                      }`}
                    >
                      Book / View Package
                      <ArrowRight className="size-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default BudgetPlannerPage;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field } from "formik";
import { 
  CookingPot, 
  Eye, 
  EyeOff, 
  Loader, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Store
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { signUp } from "../api/LoginRegister/loginRegister";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.fullName) errors.fullName = "Full Name is required";
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Minimum 8 characters required";
    }
    return errors;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex bg-base-100 overflow-hidden">
      {/* Left Pane: Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-900">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Signup Background"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-[#FF7D44]/30"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-12 rounded-2xl bg-[#FF7D44] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <CookingPot className="size-7 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">FEASTIFY.</span>
          </Link>

          <div className="max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[#FF7D44] font-black text-[10px] uppercase tracking-widest mb-6"
            >
              <ShieldCheck className="size-4" />
              Trusted by 500+ Top Vendors
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-6xl font-black text-white leading-tight mb-8"
            >
              Start Your <br />
              <span className="text-[#FF7D44]">Journey.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-white/70 font-medium leading-relaxed"
            >
              Whether you're planning a wedding or growing your catering business, we provide the platform you need to succeed.
            </motion.p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-white">99%</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Satisfaction</div>
            </div>
            <div className="w-[1px] h-10 bg-white/10"></div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">24/7</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#FF7D44]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative z-10 py-12"
        >
          <motion.div variants={itemVariants} className="text-center lg:text-left mb-10">
            <h1 className="text-4xl font-black tracking-tight mb-3">Create Account</h1>
            <p className="text-base-content/50 font-medium">Join our community and start exploring</p>
          </motion.div>

          {/* Role Toggle */}
          <motion.div variants={itemVariants} className="flex gap-4 mb-10">
            <button 
              onClick={() => setSelectedRole("user")}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                selectedRole === "user" 
                ? "border-[#FF7D44] bg-[#FF7D44]/5" 
                : "border-base-content/5 bg-base-200/30 hover:border-base-content/10"
              }`}
            >
              <User className={`size-6 ${selectedRole === "user" ? "text-[#FF7D44]" : "opacity-40"}`} />
              <span className={`text-xs font-black uppercase tracking-widest ${selectedRole === "user" ? "text-[#FF7D44]" : "opacity-40"}`}>Customer</span>
            </button>
            <button 
              onClick={() => setSelectedRole("vendor")}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                selectedRole === "vendor" 
                ? "border-[#FF7D44] bg-[#FF7D44]/5" 
                : "border-base-content/5 bg-base-200/30 hover:border-base-content/10"
              }`}
            >
              <Store className={`size-6 ${selectedRole === "vendor" ? "text-[#FF7D44]" : "opacity-40"}`} />
              <span className={`text-xs font-black uppercase tracking-widest ${selectedRole === "vendor" ? "text-[#FF7D44]" : "opacity-40"}`}>Caterer</span>
            </button>
          </motion.div>

          <Formik
            initialValues={{ fullName: "", email: "", password: "", role: "user" }}
            validate={validate}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const payload = { ...values, role: selectedRole };
                dispatch(signUp(payload, navigate));
                setSubmitting(false);
              } catch {
                toast.error("Registration failed!");
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40 group-focus-within:text-[#FF7D44] group-focus-within:opacity-100 transition-all" />
                    <Field 
                      type="text" 
                      name="fullName"
                      placeholder="John Doe"
                      className={`w-full h-14 bg-base-200/50 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 transition-all ${
                        touched.fullName && errors.fullName ? "border-error/50" : "border-transparent focus:border-[#FF7D44]/30 focus:bg-base-100"
                      }`}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40 group-focus-within:text-[#FF7D44] group-focus-within:opacity-100 transition-all" />
                    <Field 
                      type="email" 
                      name="email"
                      placeholder="name@example.com"
                      className={`w-full h-14 bg-base-200/50 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 transition-all ${
                        touched.email && errors.email ? "border-error/50" : "border-transparent focus:border-[#FF7D44]/30 focus:bg-base-100"
                      }`}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40 group-focus-within:text-[#FF7D44] group-focus-within:opacity-100 transition-all" />
                    <Field 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      placeholder="Min. 8 characters"
                      className={`w-full h-14 bg-base-200/50 rounded-2xl pl-12 pr-12 font-bold outline-none border-2 transition-all ${
                        touched.password && errors.password ? "border-error/50" : "border-transparent focus:border-[#FF7D44]/30 focus:bg-base-100"
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF7D44] transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-[10px] font-bold text-error ml-2 uppercase tracking-wider">{errors.password}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#FF7D44] text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader className="size-6 animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.div>

                <motion.p variants={itemVariants} className="text-center text-sm font-medium text-base-content/50 mt-8">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#FF7D44] font-black hover:underline underline-offset-4">
                    Sign in here
                  </Link>
                </motion.p>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;

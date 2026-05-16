import React, { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import { 
  CookingPot, 
  Eye, 
  EyeOff, 
  Loader, 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../api/LoginRegister/loginRegister";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Password is required";
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
      {/* Left Pane: Cinematic Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-900">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Catering Background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF7D44]/40 via-transparent to-black/60"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-12 rounded-2xl bg-[#FF7D44] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <CookingPot className="size-7 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">FEASTIFY.</span>
          </Link>

          <div className="max-w-md">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-6xl font-black text-white leading-tight mb-8"
            >
              Feed Your <br />
              <span className="text-[#FF7D44]">Ambition.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-white/70 font-medium leading-relaxed mb-12"
            >
              Join the elite circle of caterers and food lovers. Manage your events with ease and elegance.
            </motion.p>
            
            <div className="flex gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="size-10 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 backdrop-blur-md">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="text-white/60 text-sm font-bold flex flex-col justify-center">
                <span>Joined by 2k+ caterers</span>
                <span className="text-[#FF7D44]">★★★★★ 4.9/5</span>
              </div>
            </div>
          </div>

          <div className="text-white/40 text-xs font-bold uppercase tracking-widest">
            © 2026 Feastify Solutions. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Pane: Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#FF7D44]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative z-10"
        >
          <motion.div variants={itemVariants} className="text-center lg:text-left mb-12">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="size-14 rounded-2xl bg-[#FF7D44] flex items-center justify-center shadow-xl">
                <CookingPot className="size-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-3">Welcome Back</h1>
            <p className="text-base-content/50 font-medium">Please enter your details to sign in</p>
          </motion.div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validate={validate}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await dispatch(login(values, navigate));
                setSubmitting(false);
              } catch (error) {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
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
                  {touched.email && errors.email && (
                    <p className="text-[10px] font-bold text-error ml-2 uppercase tracking-wider">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40">Password</label>
                    <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-[#FF7D44] hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40 group-focus-within:text-[#FF7D44] group-focus-within:opacity-100 transition-all" />
                    <Field 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      placeholder="••••••••"
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
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#FF7D44] text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader className="size-6 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.div>

                <motion.div variants={itemVariants} className="relative py-4">
                  <div className="absolute inset-0 flex items-center px-2">
                    <div className="w-full border-t border-base-content/5"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-base-100 px-4 text-[10px] font-black uppercase tracking-widest opacity-30">Or continue with</span>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                  <button type="button" className="h-14 bg-base-200/50 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-base-200 transition-colors border border-transparent hover:border-base-content/5">
                    <Chrome className="size-5" />
                    Google
                  </button>
                  <button type="button" className="h-14 bg-base-200/50 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-base-200 transition-colors border border-transparent hover:border-base-content/5">
                    <Github className="size-5" />
                    GitHub
                  </button>
                </motion.div>

                <motion.p variants={itemVariants} className="text-center text-sm font-medium text-base-content/50 mt-8">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-[#FF7D44] font-black hover:underline underline-offset-4">
                    Create one for free
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

export default LoginPage;

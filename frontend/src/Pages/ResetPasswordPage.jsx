import React, { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import { 
  CookingPot, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  KeyRound,
  Loader,
  CheckCircle2
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPasswordAction } from "../api/LoginRegister/loginRegister";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Minimum 8 characters required";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirmation is required";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
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
      {/* Left Pane: Cinematic Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-900">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1633265485768-3069cb4521bc?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Reset Background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-[#FF7D44]/30"></div>
        
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
              <KeyRound className="size-4" />
              Password Reset
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-6xl font-black text-white leading-tight mb-8"
            >
              Almost <br />
              <span className="text-[#FF7D44]">Done.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-white/70 font-medium leading-relaxed"
            >
              One last step to secure your account. Choose a strong password to keep your data safe.
            </motion.p>
          </div>

          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="size-1.5 rounded-full bg-white/20"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Pane: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#FF7D44]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-10">
            <h1 className="text-4xl font-black tracking-tight mb-3">Set New Password</h1>
            <p className="text-base-content/50 font-medium">Please enter your new security credentials</p>
          </motion.div>

          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validate={validate}
            onSubmit={async (values, { setSubmitting }) => {
              await dispatch(resetPasswordAction(token, values.password, navigate));
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">New Password</label>
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

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40 group-focus-within:text-[#FF7D44] group-focus-within:opacity-100 transition-all" />
                    <Field 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword"
                      placeholder="Repeat password"
                      className={`w-full h-14 bg-base-200/50 rounded-2xl pl-12 pr-12 font-bold outline-none border-2 transition-all ${
                        touched.confirmPassword && errors.confirmPassword ? "border-error/50" : "border-transparent focus:border-[#FF7D44]/30 focus:bg-base-100"
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF7D44] transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-[10px] font-bold text-error ml-2 uppercase tracking-wider">{errors.confirmPassword}</p>
                  )}
                </motion.div>

                {/* Password Strength Checklist (Visual Only) */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 px-1">
                  <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${values.password.length >= 8 ? "text-success" : "opacity-30"}`}>
                    <CheckCircle2 className="size-3" />
                    8+ Characters
                  </div>
                  <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${values.password === values.confirmPassword && values.confirmPassword ? "text-success" : "opacity-30"}`}>
                    <CheckCircle2 className="size-3" />
                    Passwords Match
                  </div>
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
                        Reset Password
                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

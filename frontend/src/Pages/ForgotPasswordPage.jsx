import React from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import { 
  CookingPot, 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert,
  Loader
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { forgotPasswordAction } from "../api/LoginRegister/loginRegister";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
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
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Security Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-[#FF7D44]/20"></div>
        
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
              <ShieldAlert className="size-4" />
              Secure Account Recovery
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-6xl font-black text-white leading-tight mb-8"
            >
              Security <br />
              <span className="text-[#FF7D44]">First.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-white/70 font-medium leading-relaxed"
            >
              Don't worry, it happens to the best of us. We'll help you get back into your account in no time.
            </motion.p>
          </div>

          <div className="flex items-center gap-4 text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
            <span>Encrypted</span>
            <div className="size-1 bg-white/20 rounded-full"></div>
            <span>Secure</span>
            <div className="size-1 bg-white/20 rounded-full"></div>
            <span>Private</span>
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
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/40 hover:text-[#FF7D44] transition-colors mb-8 group">
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
            <h1 className="text-4xl font-black tracking-tight mb-3">Forgot Password?</h1>
            <p className="text-base-content/50 font-medium leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </motion.div>

          <Formik
            initialValues={{ email: "" }}
            validate={validate}
            onSubmit={async (values, { setSubmitting }) => {
              await dispatch(forgotPasswordAction(values.email, navigate));
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-8">
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

                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#FF7D44] text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader className="size-6 animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-base-200/50 rounded-2xl p-6 border border-base-content/5">
                  <p className="text-xs font-medium text-base-content/60 leading-relaxed text-center">
                    Please check your <b>spam folder</b> if you don't receive the email within a few minutes.
                  </p>
                </motion.div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

import React, { useState } from 'react';
import { Drawer } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { KeyRound, X, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

// Validation Schema
const ResetPasswordSchema = Yup.object().shape({
  resetPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("resetPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ResetPassword({
  open,
  handleResetPassword,
  handleClose,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const closeHandler = () => {
    if (handleClose) handleClose();
    if (handleResetPassword) handleResetPassword(false);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeHandler}
      slotProps={{
        backdrop: {
          className: "backdrop-blur-sm bg-black/40"
        }
      }}
      PaperProps={{
        className: "!bg-base-100 !text-base-content border-l border-base-content/10 font-outfit w-full sm:w-[480px] p-8 shadow-2xl flex flex-col justify-between"
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxShadow: 'none',
          backgroundImage: 'none',
        }
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-base-content tracking-tight leading-none">
                Reset Password
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-40 mt-1 block">
                Update account security
              </span>
            </div>
          </div>
          
          <button 
            onClick={closeHandler}
            className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/60 hover:text-base-content transition-all cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="w-full h-px bg-base-content/10 mb-8"></div>

        {/* Form Container */}
        <div className="flex-grow flex flex-col">
          <Formik
            initialValues={{
              resetPassword: "",
              confirmPassword: "",
            }}
            validationSchema={ResetPasswordSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                // Simulate password update process
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Password reset successfully:", values.resetPassword);
                toast.success("Password has been successfully updated!");
                resetForm();
                closeHandler();
              } catch (error) {
                toast.error("Failed to update password");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              touched,
              handleChange,
              handleBlur,
              values,
              isSubmitting,
            }) => (
              <Form className="flex-grow flex flex-col justify-between h-full">
                
                {/* Inputs at the top */}
                <div className="space-y-6">
                  {/* New Password Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        name="resetPassword"
                        value={values.resetPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Min. 6 characters"
                        className={`w-full bg-base-200 h-12 rounded-2xl pl-12 pr-12 font-bold outline-none border-2 transition-all text-sm ${
                          touched.resetPassword && errors.resetPassword 
                            ? 'border-error/50 focus:border-error bg-error/5' 
                            : 'border-base-content/10 focus:border-[#FF7D44]/50'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/75 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    {touched.resetPassword && errors.resetPassword && (
                      <span className="text-xs font-black text-error pl-2 block">
                        {errors.resetPassword}
                      </span>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Repeat your new password"
                        className={`w-full bg-base-200 h-12 rounded-2xl pl-12 pr-12 font-bold outline-none border-2 transition-all text-sm ${
                          touched.confirmPassword && errors.confirmPassword 
                            ? 'border-error/50 focus:border-error bg-error/5' 
                            : 'border-base-content/10 focus:border-[#FF7D44]/50'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/75 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <span className="text-xs font-black text-error pl-2 block">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Action at the bottom */}
                <div className="pt-8 pb-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn btn-warning h-12 rounded-2xl text-white font-black text-sm shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        Reset Password
                        <ShieldCheck className="size-4" />
                      </>
                    )}
                  </button>
                </div>

              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Drawer>
  );
}

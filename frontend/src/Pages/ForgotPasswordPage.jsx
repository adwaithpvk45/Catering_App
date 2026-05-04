import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, Formik, Field } from "formik";
import { TextField, Tooltip } from "@mui/material";
import { CookingPot, Loader } from "lucide-react";
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

  return (
    <div className="min-h-screen grid">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                <Tooltip title="Homepage">
                  <Link to={"/"}>
                    <CookingPot className="size-6 text-warning" />
                  </Link>
                </Tooltip>
              </div>
              <h1 className="text-2xl font-bold mt-2">Reset Password</h1>
              <p className="text-base-content/60">Enter your email to receive a reset link</p>
            </div>
          </div>

          <Formik
            initialValues={{ email: "" }}
            validate={validate}
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting }) => {
              dispatch(forgotPasswordAction(values.email, navigate));
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting, errors, touched }) => (
              <Form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Field
                    type="email"
                    name="email"
                    className="w-full pl-10"
                    as={TextField}
                    variant="standard"
                    label="Email Address"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </div>

                <button
                  className="btn btn-md lg:btn-lg xl:btn-xl w-full pl-10"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="size-5 animate-spin" />
                      Sending ...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center">
            <p className="text-base-content/60">
              Remember your password?{" "}
              <Link to="/login" className="link link-primary">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

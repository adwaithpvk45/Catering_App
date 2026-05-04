import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, Formik, Field } from "formik";
import { TextField, Tooltip } from "@mui/material";
import { CookingPot, Eye, EyeOff, Loader } from "lucide-react";
import { resetPasswordAction } from "../api/LoginRegister/loginRegister";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const validate = (values) => {
    const errors = {};
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = "Must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(values.password)) {
      errors.password = "Must contain at least one number";
    }
    
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords must match";
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
              <h1 className="text-2xl font-bold mt-2">Create New Password</h1>
              <p className="text-base-content/60">Please enter your new password below</p>
            </div>
          </div>

          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validate={validate}
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting }) => {
              dispatch(resetPasswordAction(token, values.password, navigate));
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting, errors, touched }) => (
              <Form className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    as={TextField}
                    className="w-full pl-10"
                    variant="standard"
                    label="New Password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-5 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    as={TextField}
                    className="w-full pl-10"
                    variant="standard"
                    label="Confirm Password"
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
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
                      Resetting ...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </Form>
            )}
          </Formik>

        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

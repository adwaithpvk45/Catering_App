import { CookingPot, Eye, EyeOff, Loader2 } from "lucide-react";
import React from "react";
import { Form, Formik, Field } from "formik";
import { useState } from "react";
import {
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
// import { useAuthStore } from '../store/useAuthStore'
import { Link, useNavigate } from "react-router-dom";
// import AuthImagePattern from '../components/AuthImagePattern'
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { signUp } from "../api/LoginRegister/loginRegister";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const validate = (values) => {
    const errors = {};
    console.log(values);
    if (!values.fullName) {
      errors.fullName = "Name is required";
      toast.error(errors.fullName);
    }
    if (!values.email) {
      errors.email = "Email is required";
      toast.error(errors.email);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
      toast.error(errors.email);
    }
    if (!values.password) {
      errors.password = "Password is required";
      toast.error(errors.password);
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      toast.error(errors.password);
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = "Must contain at least one uppercase letter";
      toast.error(errors.password);
    } else if (!/[0-9]/.test(values.password)) {
      errors.password = "Must contain at least one number";
      toast.error(errors.password);
    }
    if (!values.role) {
      errors.role = "Role should be selected";
      toast.error(errors.role);
    }
    return errors;
  };

  //   const { signUp} = useAuthStore()

  return (
    <>
      {/* <div className='min-h-screen grid lg:grid-cols-2'> */}
      <div className="min-h-screen grid pt-20">
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-12 rounded-xl bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                  <Tooltip title="Homepage">
                    <Link to={"/"}>
                      <CookingPot className="size-6 text-warning" />
                    </Link>{" "}
                  </Tooltip>
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">
                  Get started with your free account
                </p>

                <button
                  onClick={() => toast.success("Glad to meet Uuu")}
                  className="btn"
                >
                  Hi 🎉
                </button>
              </div>
            </div>
            <Formik
              initialValues={{
                fullName: "",
                email: "",
                password: "",
                role: "",
              }}
              validate={validate}
              validateOnChange={false}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  console.log(values);
                  dispatch(signUp(values,navigate));
                  // signUp(values);
                } catch (error) {
                  toast.error("SignUp unsuccessfull!");
                } finally {
                  setSubmitting(false); // optional if using Formik v2+
                }
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <Form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <Field
                      as={TextField}
                      className="w-full pl-10"
                      variant="standard"
                      type="text"
                      name="fullName"
                      label="FullName"
                    ></Field>
                  </div>
                  <div>
                    <Field
                      type="email"
                      name="email"
                      className="w-full pl-10"
                      as={TextField}
                      variant="standard"
                      label="Email"
                    ></Field>
                  </div>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      as={TextField}
                      className="w-full pl-10"
                      variant="standard"
                      label="Password"
                    ></Field>
                    <button
                      type="button"
                      className="absolute right-2 top-5 text-gray-500"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                  <div>
                    <Field
                      type="name"
                      name="role"
                      className="w-full "
                      as={Select}
                      id="role"
                      variant="standard"
                      label="Role"
                      default="User"
                    >
                      <MenuItem value="" disabled>
                        --Select Role--
                      </MenuItem>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="vendor">Vendor</MenuItem>
                    </Field>
                  </div>
                  <button
                    className="btn btn-md lg:btn-lg xl:btn-xl w-full pl-10"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Loading ...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{"  "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;

import React from "react";
import { createPortal } from "react-dom";
import { Drawer } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  X,
  ShieldAlert,
  AlignLeft,
  Layers,
  IndianRupee,
  Clock,
  ToggleLeft,
  ToggleRight,
  Check,
  ChevronDown,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  addServiceData,
  editServiceData,
} from "../../../api/vendor/vendorServiceApi";

const ServiceSchema = Yup.object().shape({
  name: Yup.string().required("Service name is required"),
  category: Yup.string().required("Service type is required"),
  price: Yup.number().positive("Rate must be positive").required("Rate is required"),
  duration: Yup.string().required("Duration is required"),
  description: Yup.string().required("Description is required"),
});

const AddEditServiceDrawer = ({
  open,
  onClose,
  initialValues,
  serviceTypes,
  mode,
  setMode,
}) => {
  const dispatch = useDispatch();

  const closeHandler = () => {
    onClose();
    setMode("add");
  };

  return createPortal(
    <Drawer
      anchor="right"
      open={open}
      onClose={closeHandler}
      slotProps={{
        backdrop: {
          className: "backdrop-blur-sm bg-black/40",
        },
      }}
      PaperProps={{
        className: "!bg-base-100 !text-base-content border-l border-base-content/10 font-outfit w-full sm:w-[480px] p-8 shadow-2xl flex flex-col justify-between",
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxShadow: "none",
          backgroundImage: "none",
        },
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-[#FF7D44]/10 text-[#FF7D44] flex items-center justify-center">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-base-content tracking-tight leading-none">
                {mode === "edit" ? "Edit" : "Add"} Service
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-40 mt-1 block">
                Manage service details
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
            enableReinitialize
            initialValues={{
              name: initialValues?.name || "",
              category: initialValues?.category || "",
              price: initialValues?.price || "",
              duration: initialValues?.duration || "",
              description: initialValues?.description || "",
              id: initialValues?._id || null,
              status: initialValues?.status || "Available",
            }}
            validationSchema={ServiceSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const id = values.id;
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("category", values.category);
                formData.append("price", values.price);
                formData.append("description", values.description);
                formData.append("duration", values.duration);
                formData.append("id", values.id);
                if (mode === "edit" && values.status) {
                  formData.append("status", values.status);
                }

                mode === "add"
                  ? await dispatch(addServiceData(formData))
                  : await dispatch(editServiceData({ id, formData }));

                resetForm();
                closeHandler();
              } catch (err) {
                console.error("Error saving service:", err);
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
              setFieldValue,
            }) => (
              <Form className="flex-grow flex flex-col justify-between h-full">
                {/* Scrollable Fields Wrapper */}
                <div className="space-y-5 overflow-y-auto pr-1 max-h-[calc(100vh-280px)]">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Service Name
                    </label>
                    <div className="relative">
                      <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                      <input
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Wedding Buffet"
                        className={`w-full bg-base-200 h-12 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 transition-all text-sm ${
                          touched.name && errors.name
                            ? "border-error/50 focus:border-error bg-error/5"
                            : "border-base-content/10 focus:border-[#FF7D44]/50"
                        }`}
                      />
                    </div>
                    {touched.name && errors.name && (
                      <span className="text-[10px] font-black text-error pl-2 block">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Category / Type Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Service Type
                    </label>
                    <div className="dropdown dropdown-bottom w-full">
                      <div 
                        tabIndex={0}
                        role="button"
                        className={`w-full bg-base-200 h-12 rounded-2xl pl-12 pr-4 flex items-center justify-between font-bold text-sm cursor-pointer border-2 transition-all ${
                          touched.category && errors.category 
                            ? 'border-error/50 focus:border-error bg-error/5' 
                            : 'border-base-content/10 focus:border-[#FF7D44]/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                          <span>{values.category || "Select service type"}</span>
                        </div>
                        <ChevronDown className="size-4 opacity-50" />
                      </div>
                      <ul 
                        tabIndex={0}
                        className="dropdown-content menu p-2 bg-base-100 border border-base-content/10 rounded-2xl w-full z-[50] shadow-2xl mt-1 font-bold text-xs"
                      >
                        {serviceTypes.map((type) => (
                          <li key={type}>
                            <a 
                              onClick={() => {
                                setFieldValue("category", type);
                                document.activeElement.blur();
                              }}
                            >
                              {type}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {touched.category && errors.category && (
                      <span className="text-[10px] font-black text-error pl-2 block">
                        {errors.category}
                      </span>
                    )}
                  </div>

                  {/* Price Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Rate / Price
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-40" />
                      <input
                        type="number"
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 500"
                        className={`w-full bg-base-200 h-12 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 transition-all text-sm ${
                          touched.price && errors.price
                            ? "border-error/50 focus:border-error bg-error/5"
                            : "border-base-content/10 focus:border-[#FF7D44]/50"
                        }`}
                      />
                    </div>
                    {touched.price && errors.price && (
                      <span className="text-[10px] font-black text-error pl-2 block">
                        {errors.price}
                      </span>
                    )}
                  </div>

                  {/* Duration Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Duration
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                      <input
                        type="text"
                        name="duration"
                        value={values.duration}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 5 hrs"
                        className={`w-full bg-base-200 h-12 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 transition-all text-sm ${
                          touched.duration && errors.duration
                            ? "border-error/50 focus:border-error bg-error/5"
                            : "border-base-content/10 focus:border-[#FF7D44]/50"
                        }`}
                      />
                    </div>
                    {touched.duration && errors.duration && (
                      <span className="text-[10px] font-black text-error pl-2 block">
                        {errors.duration}
                      </span>
                    )}
                  </div>

                  {/* Description Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={3}
                      placeholder="Detail what is included in this service (e.g. types of foods, service staff, clean-up)..."
                      className={`w-full bg-base-200 rounded-2xl p-4 font-bold outline-none border-2 transition-all text-sm leading-relaxed resize-none ${
                        touched.description && errors.description
                          ? "border-error/50 focus:border-error bg-error/5"
                          : "border-base-content/10 focus:border-[#FF7D44]/50"
                      }`}
                    />
                    {touched.description && errors.description && (
                      <span className="text-[10px] font-black text-error pl-2 block">
                        {errors.description}
                      </span>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Status
                    </label>
                    <div className="dropdown dropdown-bottom w-full">
                      <div 
                        tabIndex={0}
                        role="button"
                        className="w-full bg-base-200 h-12 rounded-2xl pl-12 pr-4 flex items-center justify-between font-bold text-sm cursor-pointer border-2 border-base-content/10 focus:border-[#FF7D44]/50 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          {values.status === "Available" ? (
                            <ToggleRight className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-success" />
                          ) : (
                            <ToggleLeft className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                          )}
                          <span>{values.status}</span>
                        </div>
                        <ChevronDown className="size-4 opacity-50" />
                      </div>
                      <ul 
                        tabIndex={0}
                        className="dropdown-content menu p-2 bg-base-100 border border-base-content/10 rounded-2xl w-full z-[50] shadow-2xl mt-1 font-bold text-xs"
                      >
                        <li>
                          <a 
                            onClick={() => {
                              setFieldValue("status", "Available");
                              document.activeElement.blur();
                            }}
                          >
                            Available
                          </a>
                        </li>
                        <li>
                          <a 
                            onClick={() => {
                              setFieldValue("status", "Unavailable");
                              document.activeElement.blur();
                            }}
                          >
                            Unavailable
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Submit button at the bottom */}
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
                        {initialValues?.id ? "Update" : "Add"} Service
                        <Check className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Drawer>,
    document.body
  );
};

export default AddEditServiceDrawer;

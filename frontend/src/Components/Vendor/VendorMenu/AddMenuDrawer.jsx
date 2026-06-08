import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Drawer } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Upload, X, ShieldAlert, AlignLeft, Layers, IndianRupee, Image, ToggleLeft, ToggleRight, Check, ChevronDown } from "lucide-react";
import { useDispatch } from "react-redux";
import { addFoodData, editFoodData } from "../../../api/vendor/vendorFoodApi";

const categories = ["Starters", "Main Course", "Desserts", "Drinks", "Snacks"];

const MenuItemSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number().positive("Price must be positive").required("Price is required"),
  image: Yup.mixed().required("Image is required"),
  description: Yup.string().required("Description is required"),
});

const AddEditMenuItemDrawer = ({
  open,
  onClose,
  initialValues,
  mode,
  setMode,
}) => {
  const [preview, setPreview] = useState(initialValues?.image || "");
  const dispatch = useDispatch();

  const closeHandler = () => {
    onClose();
    setMode("add");
    setPreview("");
  };

  return createPortal(
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
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-base-content tracking-tight leading-none">
                {mode === "add" ? "Add" : "Edit"} Menu Item
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-40 mt-1 block">
                Manage dish particulars
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
              name: initialValues?.name || "",
              category: initialValues?.category || "",
              price: initialValues?.price || "",
              image: initialValues?.image || null,
              description: initialValues?.description || "",
              id: initialValues?.id || null,
              status: initialValues?.status || "Available",
            }}
            validationSchema={MenuItemSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const id = values.id;
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("category", values.category);
                formData.append("price", values.price);
                formData.append("description", values.description);
                formData.append("foodImage", values.image);
                formData.append("id", values.id);
                if (mode === "edit" && values.status) {
                  formData.append("status", values.status);
                }

                mode === "add"
                  ? await dispatch(addFoodData(formData))
                  : await dispatch(editFoodData({ id, formData }));
                
                resetForm();
                closeHandler();
              } catch (err) {
                console.error("Error saving menu item:", err);
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
              setFieldValue
            }) => (
              <Form className="flex-grow flex flex-col justify-between h-full">
                
                {/* Scrollable Fields wrapper */}
                <div className="space-y-5 overflow-y-auto pr-1 max-h-[calc(100vh-280px)]">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Item Name
                    </label>
                    <div className="relative">
                      <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                      <input 
                        type="text" 
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Butter Chicken"
                        className={`w-full bg-base-200 h-12 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 transition-all text-sm ${
                          touched.name && errors.name 
                            ? 'border-error/50 focus:border-error bg-error/5' 
                            : 'border-base-content/10 focus:border-[#FF7D44]/50'
                        }`}
                      />
                    </div>
                    {touched.name && errors.name && (
                      <span className="text-[10px] font-black text-error pl-2 block">{errors.name}</span>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Category
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
                          <span>{values.category || "Select category"}</span>
                        </div>
                        <ChevronDown className="size-4 opacity-50" />
                      </div>
                      <ul 
                        tabIndex={0}
                        className="dropdown-content menu p-2 bg-base-100 border border-base-content/10 rounded-2xl w-full z-[50] shadow-2xl mt-1 font-bold text-xs"
                      >
                        {categories.map((cat) => (
                          <li key={cat}>
                            <a 
                              onClick={() => {
                                setFieldValue("category", cat);
                                document.activeElement.blur();
                              }}
                            >
                              {cat}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {touched.category && errors.category && (
                      <span className="text-[10px] font-black text-error pl-2 block">{errors.category}</span>
                    )}
                  </div>

                  {/* Price Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Price (INR)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-40" />
                      <input 
                        type="number" 
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 250"
                        className={`w-full bg-base-200 h-12 rounded-2xl pl-12 pr-4 font-bold outline-none border-2 transition-all text-sm ${
                          touched.price && errors.price 
                            ? 'border-error/50 focus:border-error bg-error/5' 
                            : 'border-base-content/10 focus:border-[#FF7D44]/50'
                        }`}
                      />
                    </div>
                    {touched.price && errors.price && (
                      <span className="text-[10px] font-black text-error pl-2 block">{errors.price}</span>
                    )}
                  </div>

                  {/* Image Upload Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">
                      Dish Photo
                    </label>
                    <div className="flex gap-4 items-center p-4 rounded-2xl bg-base-200/50 border border-base-content/10">
                      
                      {/* Image Preview */}
                      <div className="size-16 rounded-xl bg-base-200 overflow-hidden flex items-center justify-center border border-base-content/10 flex-shrink-0">
                        {preview ? (
                          <img src={preview} alt="Preview" className="size-full object-cover" />
                        ) : (
                          <Image className="size-6 opacity-30" />
                        )}
                      </div>

                      <div className="flex-grow">
                        <label 
                          htmlFor="dish-image-upload"
                          className="px-4 py-2 bg-base-200 hover:bg-[#FF7D44]/10 text-base-content hover:text-[#FF7D44] border border-base-content/10 hover:border-[#FF7D44]/30 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <Upload className="size-4" />
                          Choose Image
                        </label>
                        <input
                          id="dish-image-upload"
                          name="image"
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            if (file && file.type.startsWith("image/")) {
                              setFieldValue("image", file);
                              setPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                        <span className="text-[9px] font-bold opacity-45 mt-1.5 block">Accepts JPG/PNG image files.</span>
                      </div>
                    </div>
                    {touched.image && errors.image && (
                      <span className="text-[10px] font-black text-error pl-2 block">{errors.image}</span>
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
                      placeholder="Add brief details about ingredients, flavors, and allergen information..."
                      className={`w-full bg-base-200 rounded-2xl p-4 font-bold outline-none border-2 transition-all text-sm leading-relaxed resize-none ${
                        touched.description && errors.description 
                          ? 'border-error/50 focus:border-error bg-error/5' 
                          : 'border-base-content/10 focus:border-[#FF7D44]/50'
                      }`}
                    />
                    {touched.description && errors.description && (
                      <span className="text-[10px] font-black text-error pl-2 block">{errors.description}</span>
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
                        {initialValues?.id ? "Update" : "Add"} Dish Item
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

export default AddEditMenuItemDrawer;

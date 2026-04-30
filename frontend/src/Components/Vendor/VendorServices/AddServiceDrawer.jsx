import React, { useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  addServiceData,
  editServiceData,
} from "../../../api/vendor/vendorServiceApi";
import { useDispatch } from "react-redux";

const AddEditServiceDrawer = ({
  open,
  onClose,
  mode,
  setMode,
  initialValues,
  serviceTypes,
}) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: initialValues?.name || "",
      category: initialValues?.category || "",
      price: initialValues?.price || "",
      duration: initialValues?.duration || "",
      description: initialValues?.description || "",
      id: initialValues?._id || null,
      status:initialValues?.status
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Service name is required"),
      category: Yup.string().required("Service type is required"),
      price: Yup.number().positive().required("Price is required"),
      duration: Yup.string().required("Duration is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const id = values.id;
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("category", values.category);
        formData.append("price", values.price);
        formData.append("description", values.description);
        formData.append("foodImage", values.image);
        formData.append("duration", values.duration);
        formData.append("id", values.id);
        if (mode === "edit" && values.status) {
          formData.append("status", values.status);
        }
        mode === "add"
          ? await dispatch(addServiceData(formData))
          : await dispatch(editServiceData({ id, formData }));
        resetForm();
        setMode("add");
        onClose();
      } catch (err) {
        console.error("Error adding menu item:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!open) formik.resetForm();
  }, [open]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Typography variant="h4" mb={4} mt={10}>
          {mode === "edit" ? "Edit Service" : "Add New Service"}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={5}>
            <TextField
              label="Service Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth
            />

            <TextField
              select
              label="Service Type"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
              fullWidth
            >
              {serviceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Rate"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              fullWidth
            />

            <TextField
              label="Duration"
              name="duration"
              value={formik.values.duration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.duration && Boolean(formik.errors.duration)}
              helperText={formik.touched.duration && formik.errors.duration}
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
              select
              fullWidth
            >
              <MenuItem key={1} value={"Available"}>
                Available
              </MenuItem>
              <MenuItem key={2} value={"Unavailable"}>
                Unavailable
              </MenuItem>
            </TextField>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {mode === "edit" ? "Update" : "Add"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddEditServiceDrawer;

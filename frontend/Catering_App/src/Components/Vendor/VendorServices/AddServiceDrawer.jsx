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

const AddEditServiceDrawer = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  serviceTypes,
}) => {
  const isEdit = Boolean(initialValues?.id);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      serviceName: initialValues?.serviceName || "",
      serviceType: initialValues?.serviceType || "",
      rate: initialValues?.rate || "",
      duration: initialValues?.duration || "",
      description: initialValues?.description || "",
      id: initialValues?.id || null,
    },
    validationSchema: Yup.object().shape({
      serviceName: Yup.string().required("Service name is required"),
      serviceType: Yup.string().required("Service type is required"),
      rate: Yup.string().required("Rate is required"),
      duration: Yup.string().required("Duration is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  useEffect(() => {
    if (!open) formik.resetForm();
  }, [open]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
          <Box sx={{ width: 400, p: 3 }}>
              <Typography variant="h4" mb={4} mt={10}>
          {isEdit ? "Edit Service" : "Add New Service"}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={5}>
            <TextField
              label="Service Name"
              name="serviceName"
              value={formik.values.serviceName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.serviceName && Boolean(formik.errors.serviceName)}
              helperText={formik.touched.serviceName && formik.errors.serviceName}
              fullWidth
            />

            <TextField
              select
              label="Service Type"
              name="serviceType"
              value={formik.values.serviceType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.serviceType && Boolean(formik.errors.serviceType)}
              helperText={formik.touched.serviceType && formik.errors.serviceType}
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
              name="rate"
              value={formik.values.rate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.rate && Boolean(formik.errors.rate)}
              helperText={formik.touched.rate && formik.errors.rate}
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
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              multiline
              rows={3}
              fullWidth
            />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {isEdit ? "Update" : "Add"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddEditServiceDrawer;

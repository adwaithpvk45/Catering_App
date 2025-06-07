import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { UploadIcon } from "lucide-react";

const categories = ["Starters", "Main Course", "Desserts", "Drinks"];

const MenuItemSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number().positive().required("Price is required"),
  image: Yup.mixed().required("Image is required"),
  description: Yup.string().required("Description is required"),
});

const AddEditMenuItemDrawer = ({ open, onClose, onSubmit, initialValues }) => {
  console.log("🚀 ~ AddEditMenuItemDrawer ~ initialValues:", initialValues);
  const [preview, setPreview] = useState("");

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        onClose();
        setPreview("");
      }}
    >
      <Box sx={{ width: 400, p: 3 }}>
        <Typography variant="h4" mb={4} mt={10}>
          {initialValues?.id ? "Edit" : "Add"} Menu Item
        </Typography>
        <Formik
          initialValues={{
            name: initialValues?.name || "",
            category: initialValues?.category || "",
            price: initialValues?.price || "",
            image: initialValues?.image || "",
            description: initialValues?.description || "",
            id: initialValues?.id || null,
          }}
          validationSchema={MenuItemSchema}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values);
            resetForm();
            onClose();
          }}
        >
          {({ values, errors, touched, handleBlur, setFieldValue }) => (
            <Form>
              <Field
                as={TextField}
                name="name"
                label="Item Name"
                fullWidth
                margin="normal"
                value={values.name}
                onBlur={handleBlur}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />

              <Field
                as={TextField}
                select
                name="category"
                label="Category"
                fullWidth
                margin="normal"
                value={values.category}
                onBlur={handleBlur}
                error={touched.category && !!errors.category}
                helperText={touched.category && errors.category}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Field>

              <Field
                as={TextField}
                name="price"
                label="Price"
                type="string"
                fullWidth
                margin="normal"
                value={values.price}
                onBlur={handleBlur}
                error={touched.price && !!errors.price}
                helperText={touched.price && errors.price}
              />

              <Box
                mt={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  border: "1px solid lightgrey",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <Box>
                  <Typography variant="body2" mb={1}>
                    Image (JPG/PNG)
                  </Typography>
                  <Tooltip title="Upload">
                    <label htmlFor="image-upload">
                      <IconButton color="primary" component="span">
                        <UploadIcon />
                      </IconButton>
                    </label>
                  </Tooltip>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    hidden
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        setFieldValue("image", file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {touched.image && errors.image && (
                    <Typography color="error" variant="caption">
                      {errors.image}
                    </Typography>
                  )}
                </Box>
                {preview && (
                  <Box mt={2} width={50} mr={6}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ width: "100%", borderRadius: 8 }}
                    />
                  </Box>
                )}
              </Box>

              <Field
                as={TextField}
                name="description"
                label="Description"
                multiline
                rows={3}
                fullWidth
                margin="normal"
                value={values.description}
                onBlur={handleBlur}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                {initialValues?.id ? "Update" : "Add"} Item
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Drawer>
  );
};

export default AddEditMenuItemDrawer;

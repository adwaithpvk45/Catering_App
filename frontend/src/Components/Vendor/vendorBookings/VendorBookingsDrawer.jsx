import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  TextField,
  Grid,
  Button,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Form, Formik } from "formik";
import { statusChange } from "../../../api/vendor/bookingApi";
import { useDispatch } from "react-redux";

const BookingDetailsDrawer = ({ open, onClose, booking, onToggleStatus }) => {
  if (!booking) return null;

  const dispatch = useDispatch();

  const bookingFields = [
    { label: "User", value: booking.user?.name },
    { label: "Email", value: booking.user?.email },
    { label: "Category", value: booking.category },
    {
      label: "Event Date",
      value: new Date(booking.eventDate).toLocaleString(),
    },
    { label: "Venue Location", value: booking.venueLocation },
    { label: "Guest Count", value: booking.guestCount },

    { label: "Description", value: booking.description },
    { label: "Notes", value: booking.notes },
    { label: "Price", value: booking.price },
    {
      label: "Status",
      name: "status",
      value: booking.status,
      type: "select",
      options: ["Pending", "Accepted", "Cancelled"],
    },
  ];
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{ height: "100vh" }}
      >
        <Box
          p={3}
          width={600}
          sx={{ marginTop: "80px", position: "relative", height: "100%" }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h5" fontWeight="bold">
              Booking Details
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Formik
            initialValues={{
              status: booking.status || "Pending",
            }}
            onSubmit={(values) => {
              dispatch(
                statusChange({ id: booking._id, status: values.status })
              );
              onClose();
            }}
          >
            {({ values, handleChange }) => (
              <Form style={{ height: "100%" }}>
                <Grid
                  container
                  columnSpacing={5}
                  rowSpacing={3}
                  alignItems={"center"}
                  paddingLeft={3}
                >
                  {bookingFields.map((field, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      {field.type === "select" ? (
                        <TextField
                          select
                          name={field.name}
                          label={field.label}
                          value={values[field.name]}
                          onChange={handleChange}
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#555", // dark grey text
                            },
                            "& .MuiInputLabel-root.Mui-disabled": {
                              color: "#777", // dark grey label
                            },
                          }}
                          fullWidth
                        >
                          {field.options.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <TextField
                          label={field.label}
                          value={field.value || ""}
                          fullWidth
                          disabled
                          multiline={field.value?.length > 30}
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>

                {/* Submit Button */}
                <Box
                  mt={4}
                  sx={{
                    width: "90%",
                    position: "absolute",
                    bottom: "0px",
                    mb: "30px",
                    height: "50px",
                  }}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ width: "100%" }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Drawer>
    </>
  );
};

export default BookingDetailsDrawer;

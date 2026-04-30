import {
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Form, Formik } from "formik";
import * as Yup from "yup";

// Schema
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
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => handleClose()}
      sx={{
        "& .MuiDrawer-paper": {
          width: 600,
          padding: 3,
          display: "flex",
          flexDirection: "column",
          position:'relative'
        },
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        pt={10}
      >
        <Typography variant="h5">Reset Password</Typography>
        <IconButton onClick={() => handleResetPassword(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Form */}
      <Formik
        initialValues={{
          resetPassword: "",
          confirmPassword: "",
        }}
        validationSchema={ResetPasswordSchema}
        onSubmit={(values) => {
          console.log("Reset password submitted:", values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={8} justifyContent={'center'}>
              <Grid item xs={12}>
                <TextField
                  name="resetPassword"
                  label="New Password"
                  type="password"
                  value={values.resetPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.resetPassword && Boolean(errors.resetPassword)}
                  helperText={touched.resetPassword && errors.resetPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="warning"
              type="submit"
              disabled={isSubmitting}
              fullWidth
              sx={{
                marginTop:'20px',position:'absolute',bottom:'40px',right:'30px',width:'90%'

              }}
            >
              Reset Password
            </Button>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}

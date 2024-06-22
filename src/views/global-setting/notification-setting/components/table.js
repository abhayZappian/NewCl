import React from "react";
import { Box } from "@mui/system";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { useEffect } from "react";
import { createdByName, createdBy } from "../../../../helpers/userInfo";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import CircularLoader from "ui-component/CircularLoader";

const validationSchema = Yup.object().shape({
  mobilenumber: Yup.string()
    .trim()
    .matches(/^[0-9]+$/, "Mobile number must contain only numbers")
    .min(10, "Mobile number must be at least 10 digits")
    .max(10, "Mobile number cannot exceed 10 digits")
    .required("Mobile number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  slack: Yup.string()
    .matches(/^[a-zA-Z0-9._-]+$/, "Invalid Slack ID")
    .required("Slack ID is required"),
  skype: Yup.string()
    .matches(/^[a-zA-Z0-9._-]+$/, "Invalid Skype ID")
    .required("Skype ID is required"),
});

const EspTable = () => {
  const [loading, setLoading] = useState(true);
  const [buttonEditable, setButtonEditable] = useState(false);

  useEffect(() => {
    getNotificationDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      mobilenumber: "",
      email: "",
      slack: "",
      skype: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log(values);
      const data = {
        mobilenumber: values.mobilenumber,
        email: values.email,
        slack: values.slack,
        skype: values.skype,
        createdBy: createdBy,
        createdByName: createdByName,
        updatedBy: createdBy,
        updatedByName: createdByName,
      };
      addNotificationSettings(data);
      setButtonEditable(true);
    },
  });
  const addNotificationSettings = async (data) => {
    try {
      const res = await axiosInstance.post(
        apiEndPoints.saveNotificationDetails,
        data
      );
      console.log(res);
      enqueueSnackbar(`${res.data.message}`, {
        variant: "success",
      });
      setButtonEditable(false);
    } catch (error) {
      enqueueSnackbar(`${error.response.data.message}`, {
        variant: "error",
      });
      setButtonEditable(false);
      throw error;
    }
  };
  const getNotificationDetails = async () => {
    const { data } = await axiosInstance.get(apiEndPoints.notificationSettings);
    const newValue = data.result[0];
    console.log(newValue, "datatatatatatat");
    formik.setFieldValue("mobilenumber", newValue?.data?.mobileNumber);
    formik.setFieldValue("email", newValue?.data?.emailId);
    formik.setFieldValue("slack", newValue?.data?.slackId);
    formik.setFieldValue("skype", newValue?.data?.skypeId);
    setLoading(false);
  };
  return (
    <form onSubmit={formik.handleSubmit} style={{ backgroundColor: "f0f4f5" }}>
      {loading === true ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <CircularLoader />
        </Box>
      ) : (
        <>
          <Box sx={{ p: "20px 35px" }}>
            <Button disabled={buttonEditable} type="submit" variant="contained">
              Save
            </Button>
          </Box>

          <Box sx={{ padding: " 0px 50px" }}>
            <Box
              sx={{
                height: "40vh",
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <Paper
                sx={{ width: "40%" }}
                elevation={3}
                style={{ borderRadius: 10, padding: 20 }}
              >
                <Grid
                  sx={{
                    height: "100%",
                  }}
                >
                  <Grid item sx={{ width: "100%" }}>
                    <Typography sx={{ mb: 2 }} variant="h1">
                      Mobile Number
                    </Typography>
                    <hr style={{ backgroundColor: "grey" }} />
                  </Grid>
                  <Grid
                    item
                    sx={{
                      height: "60%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      type="number"
                      id="mobilenumber"
                      name="mobilenumber"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobilenumber}
                      variant="outlined"
                      inputProps={{
                        style: { fontSize: "1.2rem" }, // Change the font size here
                      }}
                      error={
                        formik.touched.mobilenumber &&
                        Boolean(formik.errors.mobilenumber)
                      }
                      helperText={
                        formik.touched.mobilenumber &&
                        formik.errors.mobilenumber
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                sx={{ width: "40%" }}
                elevation={3}
                style={{ borderRadius: 10, padding: 20 }}
              >
                <Grid
                  sx={{
                    height: "100%",
                  }}
                >
                  <Grid item sx={{ width: "100%" }}>
                    <Typography sx={{ mb: 2 }} variant="h1">
                      Email
                    </Typography>
                    <hr style={{ backgroundColor: "grey" }} />
                  </Grid>
                  <Grid
                    item
                    sx={{
                      height: "60%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      id="email"
                      name="email"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      variant="outlined"
                      inputProps={{
                        style: { fontSize: "1.2rem" }, // Change the font size here
                      }}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Box>
          {/* /// */}
          <Box sx={{ padding: "50px" }}>
            <Box
              sx={{
                height: "40vh",
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <Paper
                sx={{ width: "40%" }}
                elevation={3}
                style={{ borderRadius: 10, padding: 20 }}
              >
                <Grid
                  sx={{
                    height: "100%",
                  }}
                >
                  <Grid item sx={{ width: "100%" }}>
                    <Typography sx={{ mb: 2 }} variant="h1">
                      Slack ID
                    </Typography>
                    <hr style={{ backgroundColor: "grey" }} />
                  </Grid>

                  <Grid
                    item
                    sx={{
                      height: "60%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      id="slack"
                      name="slack"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.slack}
                      variant="outlined"
                      inputProps={{
                        style: { fontSize: "1.2rem" }, // Change the font size here
                      }}
                      error={
                        formik.touched.slack && Boolean(formik.errors.slack)
                      }
                      helperText={formik.touched.slack && formik.errors.slack}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                sx={{ width: "40%" }}
                elevation={3}
                style={{ borderRadius: 10, padding: 20 }}
              >
                <Grid
                  sx={{
                    height: "100%",
                  }}
                >
                  <Grid item sx={{ width: "100%" }}>
                    <Typography sx={{ mb: 2 }} variant="h1">
                      Skype ID
                    </Typography>
                    <hr style={{ backgroundColor: "grey" }} />
                  </Grid>
                  <Grid
                    item
                    sx={{
                      height: "60%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      id="skype"
                      name="skype"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.skype}
                      variant="outlined"
                      inputProps={{
                        style: { fontSize: "1.2rem" }, // Change the font size here
                      }}
                      error={
                        formik.touched.skype && Boolean(formik.errors.skype)
                      }
                      helperText={formik.touched.skype && formik.errors.skype}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Box>
        </>
      )}
    </form>
  );
};
export default EspTable;

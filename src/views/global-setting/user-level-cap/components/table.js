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
  emailPerDay: Yup.string().required("User Per Day is required"),
});

const EspTable = () => {
  const [loading, setLoading] = useState(true);
  const [buttonDisable, setButtonDisable] = useState(false);
  useEffect(() => {
    getUserLevelCap();
  }, []);

  const formik = useFormik({
    initialValues: {
      emailPerDay: null,
      emailPerWeek: null,
      emailPerMonth: null,
      emailPerYear: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const data = {
        emailPerDay: values.emailPerDay,
        emailPerWeek: values.emailPerWeek,
        emailPerMonth: values.emailPerMonth,
        emailPerYear: values.emailPerYear,
        userId: createdBy,
        createdBy: createdBy,
        updatedBy: createdBy,
        createdByName: createdByName,
        updatedByName: createdByName,
      };
      console.log(data);
      addUserLevelCap(data);
      setButtonDisable(true);
    },
  });

  const getUserLevelCap = async () => {
    const res = await axiosInstance.get(`${apiEndPoints.userlevelcap}`);
    console.log(res, "resss");
    let newData = res.data.result[0];
    formik.setFieldValue("emailPerWeek", newData.data.emailPerWeek);
    formik.setFieldValue("emailPerMonth", newData.data.emailPerMonth);
    formik.setFieldValue("emailPerYear", newData.data.emailPerYear);
    formik.setFieldValue("emailPerDay", newData.data.emailPerDay);
    setLoading(false);
  };

  const addUserLevelCap = async (data) => {
    try {
      const res = await axiosInstance.post(apiEndPoints.saveuserlevelcap, data);
      console.log(res);
      enqueueSnackbar(`${res.data.message}`, {
        variant: "success",
      });
      setButtonDisable(false);
    } catch (error) {
      enqueueSnackbar(`${error.response.data.message}`, {
        variant: "success",
      });
      throw error;
      setButtonDisable(false);
    }
  };
  return (
    <form onSubmit={formik.handleSubmit} style={{ backgroundColor: "#f0f4f5" }}>
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
            <Button disabled={buttonDisable} type="submit" variant="contained">
              Save
            </Button>
          </Box>

          <Box sx={{ padding: " 0 50px" }}>
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
                    <Typography variant="h1">User Per Day</Typography>
                    <hr style={{ backgroundColor: "grey" }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" sx={{ fontWeight: "100", mt: 2 }}>
                      No. of emails which can be sent to a user per Day
                    </Typography>
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
                      size="large"
                      type="number"
                      id="emailPerDay"
                      name="emailPerDay"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.emailPerDay}
                      variant="outlined"
                      inputProps={{
                        style: { fontSize: "1.2rem" }, // Change the font size here
                      }}
                      error={
                        formik.touched.emailPerDay &&
                        Boolean(formik.errors.emailPerDay)
                      }
                      helperText={
                        formik.touched.emailPerDay && formik.errors.emailPerDay
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
                    <Typography variant="h1">User Per Week</Typography>
                    <hr style={{ backgroundColor: "grey" }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" sx={{ fontWeight: "100", mt: 2 }}>
                      No. of emails which can be sent to a user per Week
                    </Typography>
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
                      id="emailPerWeek"
                      name="emailPerWeek"
                      placeholder=""
                      InputProps={{ readOnly: true }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.emailPerWeek}
                      variant="outlined"
                      inputProps={{
                        style: { fontSize: "1.2rem" }, // Change the font size here
                      }}
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
                    <Typography variant="h1">User Per Month</Typography>
                    <hr style={{ backgroundColor: "grey" }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" sx={{ fontWeight: "100", mt: 2 }}>
                      No. of emails which can be sent to a user per Month
                    </Typography>
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
                      id="emailPerMonth"
                      name="emailPerMonth"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.emailPerMonth}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        style: { fontSize: "1.2rem" }, // Change the font size here
                      }}
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
                    <Typography variant="h1">User Per Year</Typography>
                    <hr style={{ backgroundColor: "grey" }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" sx={{ fontWeight: "100", mt: 2 }}>
                      No. of emails which can be sent to a user per Year
                    </Typography>
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
                      id="emailPerYear"
                      name="emailPerYear"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.emailPerYear}
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                        style: { fontSize: "1.2rem" }, // Change the font size here
                      }}
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
